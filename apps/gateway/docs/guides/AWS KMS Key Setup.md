# Route 53 DNSSEC — Customer-Managed KMS Key Setup

> **Conventions for every `aws` command below**
>
> - Always pass `--profile flexiness` — this project targets the Flexiness AWS account through that named profile. Omitting it silently uses the default profile and will hit the wrong account.
> - Always pass `--region us-east-1` for the KSK KMS key and for Route 53 DNSSEC operations. Route 53 only accepts KMS keys in `us-east-1`.

## 1. Key Requirements (Route 53 DNSSEC constraints)

Route 53 requires a very specific KMS key shape:

| Property      | Required value                    |
| ------------- | --------------------------------- |
| Region        | **us-east-1** (mandatory)         |
| Key spec      | `ECC_NIST_P256`                   |
| Key usage     | `SIGN_VERIFY`                     |
| Origin        | `AWS_KMS` (customer-managed)      |
| Key policy    | Must grant `dnssec-route53.amazonaws.com` permission to sign |

A different region, RSA key, or symmetric key will be rejected by `CreateKeySigningKey`.

---

## 2. IAM Permissions Needed by the Caller

The IAM principal that runs the setup needs the following. Attach as an inline policy or a customer-managed policy.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "KmsForDnssecSetup",
      "Effect": "Allow",
      "Action": [
        "kms:CreateKey",
        "kms:CreateAlias",
        "kms:DescribeKey",
        "kms:GetKeyPolicy",
        "kms:PutKeyPolicy",
        "kms:ListKeys",
        "kms:ListAliases",
        "kms:GetPublicKey",
        "kms:TagResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Route53DnssecSetup",
      "Effect": "Allow",
      "Action": [
        "route53:GetHostedZone",
        "route53:GetDNSSEC",
        "route53:CreateKeySigningKey",
        "route53:ActivateKeySigningKey",
        "route53:DeactivateKeySigningKey",
        "route53:DeleteKeySigningKey",
        "route53:EnableHostedZoneDNSSEC",
        "route53:DisableHostedZoneDNSSEC",
        "route53:ChangeResourceRecordSets"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IamPassForRoute53IfNeeded",
      "Effect": "Allow",
      "Action": "iam:CreateServiceLinkedRole",
      "Resource": "arn:aws:iam::*:role/aws-service-role/dnssec-route53.amazonaws.com/*",
      "Condition": {
        "StringLike": { "iam:AWSServiceName": "dnssec-route53.amazonaws.com" }
      }
    }
  ]
}
```

Note: `kms:CreateAlias` and `kms:PutKeyPolicy` also implicitly require permission against the key once it exists — they're covered by `Resource: "*"` above. In tighter setups, scope `PutKeyPolicy` to the new key ARN after creation.

---

## 3. Methodology (CLI, step by step)

All commands target **us-east-1** and use **`--profile flexiness`**. Replace `ACCOUNT_ID`, `ADMIN_ARN`, and `example.com` accordingly.

### Step 1 — Author the key policy

Save as `ksk-key-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Id": "dnssec-policy",
  "Statement": [
    {
      "Sid": "EnableIAMUserPermissions",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::ACCOUNT_ID:root" },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "AllowRoute53DNSSECService",
      "Effect": "Allow",
      "Principal": { "Service": "dnssec-route53.amazonaws.com" },
      "Action": ["kms:DescribeKey", "kms:GetPublicKey", "kms:Sign"],
      "Resource": "*"
    },
    {
      "Sid": "AllowRoute53DNSSECToCreateGrant",
      "Effect": "Allow",
      "Principal": { "Service": "dnssec-route53.amazonaws.com" },
      "Action": ["kms:CreateGrant"],
      "Resource": "*",
      "Condition": { "Bool": { "kms:GrantIsForAWSResource": "true" } }
    },
    {
      "Sid": "AllowAdminManagement",
      "Effect": "Allow",
      "Principal": { "AWS": "ADMIN_ARN" },
      "Action": [
        "kms:DescribeKey",
        "kms:GetKeyPolicy",
        "kms:PutKeyPolicy",
        "kms:ScheduleKeyDeletion",
        "kms:CancelKeyDeletion",
        "kms:EnableKey",
        "kms:DisableKey"
      ],
      "Resource": "*"
    }
  ]
}
```

> ⚠️ **Do not skip `--policy file://ksk-key-policy.json` in the next step.** Without it, AWS applies the *default* KMS key policy, which does not authorize the Route 53 service principal. `create-key-signing-key` will then fail with `InvalidKMSArn` (see §5 for recovery).

### Step 2 — Create the KMS key

```bash
aws kms create-key \
  --profile flexiness \
  --region us-east-1 \
  --description "Route53 DNSSEC KSK for example.com" \
  --key-usage SIGN_VERIFY \
  --customer-master-key-spec ECC_NIST_P256 \
  --policy file://ksk-key-policy.json \
  --tags TagKey=Purpose,TagValue=Route53-DNSSEC TagKey=Domain,TagValue=example.com
```

Capture `KeyMetadata.Arn` and `KeyMetadata.KeyId` from the response.

### Step 3 — Create an alias (optional but recommended)

```bash
aws kms create-alias \
  --profile flexiness \
  --region us-east-1 \
  --alias-name alias/route53-dnssec-example-com \
  --target-key-id <KeyId>
```

### Step 4 — Create the Key Signing Key in Route 53

```bash
aws route53 create-key-signing-key \
  --profile flexiness \
  --region us-east-1 \
  --caller-reference "ksk-example-com-$(date +%s)" \
  --hosted-zone-id <HOSTED_ZONE_ID> \
  --key-management-service-arn <KMS_KEY_ARN> \
  --name ksk_example_com \
  --status ACTIVE
```

### Step 5 — Enable DNSSEC signing on the zone

```bash
aws route53 enable-hosted-zone-dnssec \
  --profile flexiness \
  --region us-east-1 \
  --hosted-zone-id <HOSTED_ZONE_ID>
```

### Step 6 — Retrieve the DS record for your registrar

```bash
aws route53 get-dnssec \
  --profile flexiness \
  --region us-east-1 \
  --hosted-zone-id <HOSTED_ZONE_ID>
```

In the response, `KeySigningKeys[].DSRecord` is what you submit to the registrar. The fields you typically need to map:

- `KeyTag`
- `SigningAlgorithmType` (13 for ECDSAP256SHA256)
- `DigestType` (2 for SHA-256)
- `DigestValue`

### Step 7 — Apply DS record at the registrar

Submit those four fields. Then verify propagation:

```bash
dig +dnssec +short DS example.com @8.8.8.8
delv example.com @8.8.8.8
```

---

## 4. Verification & Teardown

**Verify chain of trust** (once the registrar publishes the DS):

```bash
aws route53 get-dnssec \
  --profile flexiness \
  --region us-east-1 \
  --hosted-zone-id <HOSTED_ZONE_ID> \
  --query 'Status.ServeSignature'
# Expect: "SIGNING"
```

**To roll back** (order matters):

```bash
# 1. Remove DS record at registrar, wait for TTL
# 2. Disable zone signing
aws route53 disable-hosted-zone-dnssec \
  --profile flexiness --region us-east-1 \
  --hosted-zone-id <HOSTED_ZONE_ID>

# 3. Deactivate + delete KSK
aws route53 deactivate-key-signing-key \
  --profile flexiness --region us-east-1 \
  --hosted-zone-id <HOSTED_ZONE_ID> --name ksk_example_com
aws route53 delete-key-signing-key \
  --profile flexiness --region us-east-1 \
  --hosted-zone-id <HOSTED_ZONE_ID> --name ksk_example_com

# 4. Schedule KMS key deletion (7–30 days)
aws kms schedule-key-deletion \
  --profile flexiness --region us-east-1 \
  --key-id <KeyId> --pending-window-in-days 7
```

---

## 5. Recovering from `InvalidKMSArn`

### Symptom

`aws route53 create-key-signing-key` returns:

```
An error occurred (InvalidKMSArn) when calling the CreateKeySigningKey operation:
The customer managed KMS key with the ARN 'arn:aws:kms:us-east-1:<ACCOUNT_ID>:key/<KEY_ID>'
does not grant all the required permissions for DNSSEC usage. Please review the key policy,
and verify that you and Route 53 have permissions for the following actions:
DescribeKey, GetPublicKey, and Sign.
```

### Why this happens

`kms create-key` was run **without** `--policy file://ksk-key-policy.json`, so AWS applied the **default** key policy. The default policy delegates to IAM (via the account-root principal) but does **not** grant anything to `dnssec-route53.amazonaws.com`, so Route 53 cannot sign with the key.

The same error also appears if the supplied policy file was truncated or otherwise missing the `Service: dnssec-route53.amazonaws.com` statements.

### Fix — replace the key policy in place

You do **not** need to recreate the key (and shouldn't — that loses the ARN). Replace the key policy with `put-key-policy`:

**1. Inspect the current policy:**

```bash
mkdir -p tmp
aws kms get-key-policy \
  --profile flexiness \
  --region us-east-1 \
  --key-id <KEY_ID> \
  --policy-name default \
  --output text > tmp/current-key-policy.json
```

Open `tmp/current-key-policy.json`. If there is no statement whose `Principal.Service` is `"dnssec-route53.amazonaws.com"`, that confirms the diagnosis.

**2. Apply the correct policy** (the same JSON from §3 Step 1):

```bash
aws kms put-key-policy \
  --profile flexiness \
  --region us-east-1 \
  --key-id <KEY_ID> \
  --policy-name default \
  --policy file://ksk-key-policy.json
```

`put-key-policy` is idempotent and replaces the entire policy — no downtime, no key rotation, ARN unchanged.

**3. Verify the live policy contains the Route 53 service principal:**

```bash
aws kms get-key-policy \
  --profile flexiness \
  --region us-east-1 \
  --key-id <KEY_ID> \
  --policy-name default \
  --output text | jq '.Statement[].Principal'
```

Expect to see both `"AWS": "arn:aws:iam::<ACCOUNT_ID>:root"` and `"Service": "dnssec-route53.amazonaws.com"` (twice — once for `Sign`/`DescribeKey`/`GetPublicKey`, once for `CreateGrant`).

**4. Re-run the original command** with a fresh `--caller-reference`:

```bash
aws route53 create-key-signing-key \
  --profile flexiness \
  --region us-east-1 \
  --caller-reference "ksk-example-com-$(date +%s)" \
  --hosted-zone-id <HOSTED_ZONE_ID> \
  --key-management-service-arn <KMS_KEY_ARN> \
  --name ksk_example_com \
  --status ACTIVE
```

Then continue from §3 Step 5 (`enable-hosted-zone-dnssec`).

---

## Common pitfalls

- **Wrong region** — Route 53 only accepts KMS keys in `us-east-1`, even though Route 53 itself is global.
- **Missing `CreateGrant` with the `GrantIsForAWSResource` condition** — `create-key-signing-key` will fail with an authorization error.
- **Using a symmetric or RSA key** — must be `ECC_NIST_P256` + `SIGN_VERIFY`.
- **Reusing one KMS key across multiple zones** — allowed, but rotations and audits get awkward; prefer one KSK per zone.
- **Forgetting the DS record TTL when disabling** — wait at least one TTL window after removing DS at the registrar before disabling signing, or resolvers will SERVFAIL.
- **Omitting `--profile flexiness`** — falls back to the default AWS profile, which targets a different account. Always include it.
