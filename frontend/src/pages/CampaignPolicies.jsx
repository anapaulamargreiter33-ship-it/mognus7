import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLang } from "@/campaign/i18n";

const CONTENT = {
  pt: {
    privacy: {
      title: "Política de Privacidade",
      intro: "A presente Política de Privacidade explica como a MOGNU'S trata os dados pessoais recolhidos na landing page da campanha de cozinhas.",
      sections: [
        ["Responsável pelo tratamento", "MOGNU'S LDA, com sede na Estrada de Vale Judeu 8, 8100-298 Loulé, Portugal. Contacto para questões de privacidade: geral@mognuscompany.com."],
        ["Dados recolhidos", "Através do formulário de contacto: nome, telefone, e-mail, localidade, modelo de cozinha de interesse, mensagem e idioma. Tecnicamente: data e hora do pedido, origem da campanha (parâmetros UTM) e endereço IP associado ao pedido."],
        ["Finalidade e base legal", "Os dados são utilizados para analisar e responder ao seu pedido de contacto e, se houver consentimento expresso, para envio de comunicações comerciais. A base legal é a execução de medidas pré-contratuais a pedido do titular e, para comunicações comerciais, o consentimento."],
        ["Conservação", "Os pedidos de contacto são conservados durante 24 meses, salvo obrigação legal ou relação comercial em curso."],
        ["Partilha", "Os dados não são vendidos nem partilhados para fins publicitários de terceiros. Podem ser processados por fornecedores de alojamento e serviços técnicos que atuam como subcontratantes."],
        ["Os seus direitos", "Pode solicitar acesso, correção, eliminação, limitação e portabilidade dos seus dados, bem como retirar o consentimento a qualquer momento, através de geral@mognuscompany.com."],
        ["Cookies", "Consulte a nossa Política de Cookies para saber como gerir cookies de análise e publicidade."],
      ],
      back: "Voltar à campanha",
    },
    cookies: {
      title: "Política de Cookies",
      intro: "Esta página explica que cookies utiliza a landing page da campanha e como os pode gerir.",
      sections: [
        ["Essenciais", "Necessários ao funcionamento do site: gestão de idioma, de sessão e do seu consentimento de cookies. Não requerem consentimento e não podem ser desativados."],
        ["Análise", "Com o seu consentimento, utilizamos o PostHog para medir visitas e o desempenho das campanhas. Estes cookies só são ativados após autorização e podem ser desativados nas preferências."],
        ["Publicidade", "Com o seu consentimento, pode ser ativado o Meta Pixel para medir conversões dos anúncios do Instagram e Facebook. Só é ativado após autorização e quando configurado pela MOGNU'S."],
        ["Como alterar as suas escolhas", "Pode alterar ou retirar o seu consentimento a qualquer momento limpando os dados do navegador ou contactando geral@mognuscompany.com."],
      ],
      back: "Voltar à campanha",
    },
  },
  de: {
    privacy: {
      title: "Datenschutzrichtlinie",
      intro: "Diese Datenschutzrichtlinie erklärt, wie MOGNU'S die auf der Aktions-Landingpage erhobenen personenbezogenen Daten verarbeitet.",
      sections: [
        ["Verantwortlicher", "MOGNU'S LDA, Estrada de Vale Judeu 8, 8100-298 Loulé, Portugal. Datenschutzanfragen: geral@mognuscompany.com."],
        ["Erhobene Daten", "Über das Kontaktformular: Name, Telefon, E-Mail, Ort, gewünschtes Küchenmodell, Nachricht und Sprache. Technisch: Datum und Uhrzeit der Anfrage, Kampagnenherkunft (UTM-Parameter) und IP-Adresse."],
        ["Zweck und Rechtsgrundlage", "Die Daten werden verwendet, um Ihre Kontaktanfrage zu prüfen und zu beantworten und — bei ausdrücklicher Einwilligung — um kommerzielle Mitteilungen zu senden. Rechtsgrundlage: vorvertragliche Maßnahmen bzw. Einwilligung."],
        ["Speicherdauer", "Kontaktanfragen werden 24 Monate aufbewahrt, sofern keine gesetzlichen Pflichten oder laufenden Geschäftsbeziehungen bestehen."],
        ["Weitergabe", "Die Daten werden nicht verkauft oder zu Werbezwecken an Dritte weitergegeben. Hosting- und technische Dienstleister können als Auftragsverarbeiter tätig sein."],
        ["Ihre Rechte", "Sie können Auskunft, Berichtigung, Löschung, Einschränkung und Übertragbarkeit verlangen sowie Ihre Einwilligung jederzeit widerrufen: geral@mognuscompany.com."],
        ["Cookies", "Siehe unsere Cookie-Richtlinie zur Verwaltung von Analyse- und Werbe-Cookies."],
      ],
      back: "Zurück zur Aktion",
    },
    cookies: {
      title: "Cookie-Richtlinie",
      intro: "Diese Seite erklärt, welche Cookies die Aktions-Landingpage verwendet und wie Sie diese verwalten können.",
      sections: [
        ["Unverzichtbar", "Für den Betrieb der Website notwendig: Sprach- und Sitzungsverwaltung sowie Speicherung Ihrer Cookie-Einwilligung. Kein Einwilligung erforderlich."],
        ["Analyse", "Mit Ihrer Zustimmung verwenden wir PostHog, um Besuche und Kampagnenleistung zu messen. Diese Cookies werden erst nach Zustimmung aktiviert."],
        ["Werbung", "Mit Ihrer Zustimmung kann der Meta Pixel zur Messung der Instagram- und Facebook-Anzeigenkonversionen aktiviert werden — erst nach Zustimmung und Konfiguration durch MOGNU'S."],
        ["Änderung der Auswahl", "Sie können Ihre Einwilligung jederzeit ändern oder widerrufen, indem Sie die Browserdaten löschen oder geral@mognuscompany.com kontaktieren."],
      ],
      back: "Zurück zur Aktion",
    },
  },
  fr: {
    privacy: {
      title: "Politique de Confidentialité",
      intro: "La présente Politique de Confidentialité explique comment MOGNU'S traite les données personnelles collectées sur la landing page de la campagne de cuisines.",
      sections: [
        ["Responsable du traitement", "MOGNU'S LDA, Estrada de Vale Judeu 8, 8100-298 Loulé, Portugal. Contact : geral@mognuscompany.com."],
        ["Données collectées", "Via le formulaire : nom, téléphone, e-mail, localité, modèle de cuisine souhaité, message et langue. Techniquement : date et heure, origine de la campagne (paramètres UTM) et adresse IP."],
        ["Finalité et base légale", "Les données servent à analyser et répondre à votre demande de contact et, avec votre consentement exprès, à l'envoi de communications commerciales. Base légale : mesures précontractuelles et consentement."],
        ["Conservation", "Les demandes sont conservées 24 mois, sauf obligation légale ou relation commerciale en cours."],
        ["Partage", "Les données ne sont ni vendues ni partagées à des fins publicitaires tierces. Des prestataires d'hébergement et techniques peuvent agir comme sous-traitants."],
        ["Vos droits", "Vous pouvez demander l'accès, la rectification, l'effacement, la limitation et la portabilité, et retirer votre consentement à tout moment : geral@mognuscompany.com."],
        ["Cookies", "Consultez notre Politique de Cookies pour gérer les cookies d'analyse et de publicité."],
      ],
      back: "Retour à la campagne",
    },
    cookies: {
      title: "Politique de Cookies",
      intro: "Cette page explique les cookies utilisés par la landing page de la campagne et comment les gérer.",
      sections: [
        ["Essentiels", "Nécessaires au fonctionnement du site : gestion de la langue, de la session et de votre consentement. Ne nécessitent pas de consentement."],
        ["Analyse", "Avec votre consentement, nous utilisons PostHog pour mesurer les visites et la performance des campagnes. Activés uniquement après autorisation."],
        ["Publicité", "Avec votre consentement, le Meta Pixel peut être activé pour mesurer les conversions des annonces Instagram et Facebook — uniquement après autorisation et configuration par MOGNU'S."],
        ["Modifier vos choix", "Vous pouvez modifier ou retirer votre consentement à tout moment en effaçant les données du navigateur ou en contactant geral@mognuscompany.com."],
      ],
      back: "Retour à la campagne",
    },
  },
  es: {
    privacy: {
      title: "Política de Privacidad",
      intro: "Esta Política de Privacidad explica cómo MOGNU'S trata los datos personales recogidos en la landing page de la campaña de cocinas.",
      sections: [
        ["Responsable del tratamiento", "MOGNU'S LDA, con sede en Estrada de Vale Judeu 8, 8100-298 Loulé, Portugal. Contacto: geral@mognuscompany.com."],
        ["Datos recogidos", "Mediante el formulario: nombre, teléfono, e-mail, localidad, modelo de cocina de interés, mensaje e idioma. Técnicamente: fecha y hora, origen de la campaña (parámetros UTM) y dirección IP."],
        ["Finalidad y base legal", "Los datos se utilizan para analizar y responder a su solicitud de contacto y, si hay consentimiento expreso, para enviar comunicaciones comerciales. Base legal: medidas precontractuales y consentimiento."],
        ["Conservación", "Las solicitudes se conservan durante 24 meses, salvo obligación legal o relación comercial en curso."],
        ["Cesión", "Los datos no se venden ni se ceden a terceros con fines publicitarios. Proveedores de alojamiento y servicios técnicos pueden actuar como encargados del tratamiento."],
        ["Sus derechos", "Puede solicitar acceso, rectificación, supresión, limitación y portabilidad, así como retirar el consentimiento en cualquier momento: geral@mognuscompany.com."],
        ["Cookies", "Consulte nuestra Política de Cookies para gestionar cookies de análisis y publicidad."],
      ],
      back: "Volver a la campaña",
    },
    cookies: {
      title: "Política de Cookies",
      intro: "Esta página explica qué cookies utiliza la landing page de la campaña y cómo gestionarlas.",
      sections: [
        ["Esenciales", "Necesarias para el funcionamiento del sitio: gestión de idioma, sesión y su consentimiento de cookies. No requieren consentimiento."],
        ["Análisis", "Con su consentimiento, usamos PostHog para medir visitas y el rendimiento de las campañas. Solo se activan tras su autorización."],
        ["Publicidad", "Con su consentimiento, puede activarse el Meta Pixel para medir conversiones de los anuncios de Instagram y Facebook — solo tras autorización y configuración por MOGNU'S."],
        ["Cambiar sus opciones", "Puede modificar o retirar su consentimiento en cualquier momento borrando los datos del navegador o contactando geral@mognuscompany.com."],
      ],
      back: "Volver a la campaña",
    },
  },
};

export default function CampaignPolicies({ page = "privacy" }) {
  const { lang } = useLang();
  const [content, setContent] = useState(CONTENT.pt);

  useEffect(() => {
    setContent(CONTENT[lang] || CONTENT.pt);
  }, [lang, page]);

  const data = content[page] || content.privacy;

  return (
    <main className="min-h-screen bg-bone pb-20 pt-32 text-ivory antialiased" data-testid={`policy-${page}`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-dark">
            <span className="h-px w-10 bg-brass" />
            MOGNU'S · RGPD
          </p>
          <h1 className="font-serif text-4xl font-light text-ivory sm:text-5xl">{data.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-mute">{data.intro}</p>
          <div className="mt-10 space-y-8">
            {data.sections.map(([title, text]) => (
              <section key={title}>
                <h2 className="font-serif text-2xl text-ivory">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">{text}</p>
              </section>
            ))}
          </div>
          <div className="mt-12 border-t border-line pt-8">
            <Link to="/cozinha" data-testid="policy-back" className="rounded-full border border-walnut/40 px-7 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-walnut transition-colors hover:border-brass hover:text-brass-dark">
              ← {data.back}
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
