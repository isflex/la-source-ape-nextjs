'use client';

import classNames from 'classnames';
import { default as flexStyles } from '@flex-design-system/framework';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Link } from '@flex-design-system/react-ts/client-sync-styled-direct/link';

export default function CagnotteInfoPage() {
  return (
    <Box>
      <div className={classNames(
        flexStyles.isFlex,
        flexStyles.isFlexDirectionColumn,
        flexStyles.isAlignItemsCenter,
        flexStyles.isJustifyContentCenter
      )}>
        <div style={{ maxWidth: '800px', padding: '2rem' }}>
          <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.hasTextCentered)}>
            Cagnottes APE La Source
          </Title>

          <Text style={{ marginTop: '1rem', marginBottom: '2rem' }} className={classNames(flexStyles.hasTextCentered)}>
            Bienvenue sur la plateforme de cagnottes collectives de l&apos;Association
            des Parents d&apos;Eleves de La Source.
          </Text>

          <Title level={TitleLevel.LEVEL2}>Notre mission</Title>
          <Text style={{ marginBottom: '1.5rem' }}>
            Nous facilitons l&apos;organisation de cagnottes pour les cadeaux de fin
            d&apos;annee destines aux enseignants et au personnel de l&apos;ecole.
            Cette plateforme permet aux parents de contribuer facilement et en toute
            securite aux cadeaux collectifs.
          </Text>

          <Title level={TitleLevel.LEVEL2}>Comment ca marche ?</Title>
          <div style={{ marginBottom: '1.5rem' }}>
            <Text><strong>1. Creation</strong></Text>
            <Text style={{ marginBottom: '0.5rem' }}>
              Un parent organisateur cree une cagnotte pour sa classe en definissant
              l&apos;objectif, la date limite et le destinataire du cadeau.
            </Text>

            <Text><strong>2. Contribution</strong></Text>
            <Text style={{ marginBottom: '0.5rem' }}>
              Les autres parents de la classe contribuent en ligne de maniere securisee
              via carte bancaire ou virement SEPA.
            </Text>

            <Text><strong>3. Achat du cadeau</strong></Text>
            <Text style={{ marginBottom: '0.5rem' }}>
              Une fois la cagnotte cloturee, l&apos;organisateur recoit les fonds
              collectes et peut acheter le cadeau pour l&apos;enseignant.
            </Text>
          </div>

          <Title level={TitleLevel.LEVEL2}>Securite des paiements</Title>
          <Text style={{ marginBottom: '1.5rem' }}>
            Tous les paiements sont securises via <strong>Stripe</strong>, leader mondial des
            solutions de paiement en ligne. Vos donnees bancaires ne sont jamais
            stockees sur nos serveurs.
          </Text>

          <Title level={TitleLevel.LEVEL2}>A propos de l&apos;APE La Source</Title>
          <Text style={{ marginBottom: '1.5rem' }}>
            L&apos;Association des Parents d&apos;Eleves de La Source accompagne les familles
            et l&apos;ecole dans de nombreuses initiatives tout au long de l&apos;annee scolaire.
            Cette plateforme de cagnottes fait partie des outils que nous mettons a
            disposition des parents pour faciliter la vie scolaire.
          </Text>

          <Title level={TitleLevel.LEVEL2}>Contact</Title>
          <Text>
            Pour toute question concernant les cagnottes ou la plateforme :
          </Text>
          <Text style={{ marginTop: '0.5rem' }}>
            <Link href="mailto:contact@apelasource.org">contact@apelasource.org</Link>
          </Text>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/cagnotte/">
              Retour a l&apos;accueil des cagnottes
            </Link>
          </div>
        </div>
      </div>
    </Box>
  );
}
