# PRD — MOGNU'S · Mognus Company — Carpintaria & Mobiliário (Loulé, Algarve)

## Campanha "Cozinhas em 15 dias" (2026-10-16)
- Landing page premium multilingue em /cozinha (PT-PT padrão + DE/FR/ES, seletor elegante, idioma do navegador sugerido) RECONSTRUÍDA (2026-10-17) 1:1 sobre o site de referência do cliente (mognus-cozinhas-campanha.anapauladuarte.chatgpt.site) com a identidade MOGNU'S. 11 secções por ordem: hero ("A cozinha com que sempre sonhou, feita à sua medida." + CTA WhatsApp direto com texto da campanha + "Explorar cozinhas"), galeria "Qual destas coizinhas combina consigo?" com 6 modelos (badge "Imagem de inspiração", lightbox com pré-seleção de estilo), "Encontrou a cozinha ideal?", processo em 3 passos + nota honesta de 15 dias úteis, sobre compacto "A sua visão, a nossa arte." com CTA ao site oficial, formulário INLINE em #pedido (nome/e-mail/telefone/localidade obrigatórios, estilo, RGPD obrigatório, consentimento comercial opcional, honeypot) que grava no CRM e abre o WhatsApp pré-preenchido, CTA final "Vamos dar forma à sua cozinha?" com o VÍDEO do anúncio (/videos/video_anuncio.mp4 — sem autoplay, com poster), ligação reservada ao painel admin, secção "Privacidade e cookies", footer e banner de cookies.
- Painel administrativo privado em /cozinha/admin: autenticação real JWT (bcrypt, cookies httpOnly, brute-force 5 tentativas/15min, recuperação por token), métricas (visitas, únicos, pedidos, conversão, por dia/modelo/idioma/estado/origem, filtros), CRM (estados Novo→Contactado→Em avaliação→Proposta→Cliente + Sem resposta/Não convertido/Arquivado, pesquisa, notas internas, export CSV), gestão de utilizadores (criar/revogar).
- Credenciais de teste: /app/memory/test_credentials.md (admin@mognuscompany.com / Mognus#2026-Cozinhas).
- Vídeo do anúncio: INSERIDO na secção final "Vamos dar forma à sua cozinha?" (decisão do cliente 2026-10-17, substitui a decisão anterior de o excluir da landing). Sem autoplay, com poster e "Rever a apresentação".
- Campo `marketing` (bool) adicionado ao LeadIn no backend; CRM mostra badge de marketing. Testado por pytest (8/8) e E2E (11/11) em 2026-10-17.
- Domínio próprio (ex.: cozinhas.mognuscompany.com): a ligar posteriormente pelo cliente. PREPARADO no código (2026-10-17): quando o hostname começa por "cozinhas.", a raiz "/" renderiza a landing da campanha (App.js, isCampaignHost), com title + canonical próprios; CORS do backend já é aberto (allow_origins ["*"]), pelo que não são precisos segredos adicionais. Passos de ligação: Manage Publishes → Domain → Auto-link (ou manual: 2× registo A "cozinhas" → 162.159.142.117 e 172.66.2.113 + CNAME www.cozinhas → cozinhas.mognuscompany.com; Cloudflare em "DNS only") → Link Manually → Check Status; SSL automático; sem redeploy obrigatório.

## Reajuste final (2026-10-17) — espelho do site verdadeiro
- Estrutura da /cozinha copiada 1:1 do mognuscompany.com (exemplo enviado pelo cliente): hero, modelos (galeria), encontrou a cozinha ideal, campanha 15 dias, processo, "Porquê a Mognu's?" (3 razões reais), "A nossa história" (Jardel Silveira, carpintaria aos 8 anos no Brasil, ~20 anos Brasil/Portugal/França/Suíça, citação do fundador, origem do nome, missão/visão — textos oficiais), "Dê vida às suas ideias" (WhatsApp pré-preenchido, e-mail) e rodapé com Livro de Reclamações.
- Logótipo oficial corrigido: ficheiro autêntico logo-claro-312.png (martelo + louros + MOGNU'S, fundo transparente) extraído do site verdadeiro e aplicado na campanha, no site institucional, no painel admin e no favicon (composto sobre quadrado escuro). O monograma "M" foi removido de todas as páginas.
- Fotos reais do site verdadeiro reutilizadas: fundador-jardel.webp, contacto-interior.webp, arvore-origem.webp.
- Pendente: notificação de conclusão do deploy (job a4e3dc54…). Se o site no ar ainda mostrar o monograma antigo após o deploy, premir Redeploy uma vez para incluir o reajuste final.

## Problema original (verbatim)
"Quero que você insira no meu site todas as imagens dos produtos e seus respectivos preços que estão no site que vou enviar... Melhore bastante a qualidade das imagens... Inclua a marca MOGNU'S nos móveis... Disponibilize lupa e ampliação..."
## Iteração 2 (verbatim resumido): "O site ficou muito lindo! Quero manter exatamente esse estilo... a MOGNU'S é uma carpintaria que também vende colchões e outros produtos, então retire a apresentação como 'ateliê'. Você está usando produtos que não são os nossos. Substitua pelas imagens dos produtos reais... com os respectivos preços."

## Dados reais
- Empresa: Mognus Company (MOGNU'S), carpintaria em Loulé, Algarve — mognuscompany.com.
- Catálogo real: 43 produtos da loja oficial (nomes, preços €, fotos mapeadas 1:1 do site oficial + arquivo imgs.rar do cliente). 14 peças "a partir de", 1 "sob consulta" (Mesa de Apoio Pôpa), demais preço fixo.
- Contato real: geral@mognuscompany.com · Estrada da Cimpor, Cabeça Alta 7, 8100-298 Loulé.

## Referências recebidas
- Vídeo do site de origem: eu.savoirbeds.com (Savoir Beds) — catálogo de colchões de luxo.
- Fotos de referência: cama em madeira com placa de latão gravada "Mognu's" (aplicação da marca) e estilo editorial de roupa de cama.

## Decisões tomadas (defaults aplicados)
- Fase 1 usava o catálogo Savoir Beds como referência; na fase 2 (2026-10-13) o catálogo foi SUBSTITUÍDO pelos 43 produtos reais da Mognus Company (loja oficial), conforme pedido do cliente.
- Design aprovado pelo cliente mantido intacto: hero cinético, marquee editorial, grid 5/7, lupa 2,4×, lightbox 1×/1,75×/3×, seção escura, footer gigante.
- Posicionamento corrigido: "Carpintaria" (não "ateliê") — hero, nav, seção "Sob Medida" (cozinhas, roupeiros, closets, escadas, escritórios com fotos reais aprimoradas da carpintaria) e footer com contato real.
- 51 imagens aprimoradas por IA a partir das fotos reais (fidelidade de modelo/cor/material) + placa de latão MOGNU'S gravada; macro da placa disponível em todos os produtos no lightbox.
- Abas: Tudo (43), Camas & Colchões (11), Sofás (9), Mesas (10), Mobiliário (13).

## Arquitetura
- Backend: FastAPI + Motor (MongoDB). Endpoints: GET /api/, GET /api/products?collection=, GET /api/products/{slug}. Seed idempotente em /app/backend/seed/products.json (só popula coleção vazia). Dados crus de referência: /app/backend/seed/source_extract.json.
- Frontend: React CRA + Tailwind + framer-motion + lenis. Imagens servidas de /images/** (public), baixadas do storage da geração.
- Modelo Product: PyObjectId coercion, from_mongo/to_mongo, sem ObjectId cru em resposta.

## UI/UX (diretriz: design_guidelines.json)
- Paleta: bone #FAF8F5 / tinta #161311 / latão #C59B27 / nogueira #3D2B1F. Fontes: Cormorant Garamond (display) + Plus Jakarta Sans (corpo).
- Hero cinético com reveal linha a linha (máscara) + parallax + véu de abertura; marquee editorial lento (55s); grid editorial 5/7; lupa circular 2,4× no hover; lightbox com zoom 1×/1,75×/3× + arrasto + macro da placa; seção Atelier com parallax; footer com wordmark vazado gigante.
- Logo original MOGNU'S (monograma M em anel de latão) + favicon SVG.

## Implementado (2026-10-13)
- Catálogo completo com preços corretos (23 peças), lupa + ampliação, marca aplicada nas fotos, hero/marquee/atelier/footer, testids em todos os elementos interativos, API validada por curl, screenshots desktop 1440 e mobile 390 sem overflow e sem overlay de erro.
- 2ª fase (mesmo dia): os 43 móveis (Bed Designs) adicionados — aba "Móveis" com 43 peças únicas, preços exatos (6.452,50 € preservado) e 14 peças "Sob consulta" (sem preço publicado na origem). Total do catálogo: 66 produtos. Verificado desktop + mobile.

## Backlog / P0-P2
- P0: adicionar coleções restantes do site de origem (roupa de cama, protetores, linho/algodão).
- P1: página de detalhe por produto (medidas por tamanho, preços por variante da API de origem); consultoria/agendamento (modal com formulário + e-mail).
- P2: SEO completo (skill farm-seo-setup: OG images, sitemap), i18n PT/EN, WhatsApp comercial real.

## Próximos passos
1. Painel do usuário para editar preços/estoque.
2. Integração de e-mail real para consultorias.
3. Deploy (primeiro Deploy copia o banco do preview uma vez).
