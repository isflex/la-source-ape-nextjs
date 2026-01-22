# Source - https://stackoverflow.com/a
# Posted by Eduardo
# Retrieved 2026-01-21, License - CC BY-SA 4.0

# deleteAllUsers.sh
COGNITO_USER_POOL_ID=$1

aws cognito-idp list-users --user-pool-id $COGNITO_USER_POOL_ID |
jq -r '.Users | .[] | .Username' |
while read user; do
  aws cognito-idp admin-delete-user --user-pool-id $COGNITO_USER_POOL_ID --username $user
  echo "$user deleted"

  # echo "$user would be deleted"  # Dry run
done
