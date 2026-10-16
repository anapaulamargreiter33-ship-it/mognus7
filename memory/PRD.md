# PRD — MOGNU'S · Mognus Company — Carpintaria & Mobiliário (Loulé, Algarve)

## Campanha "Cozinhas em 15 dias" (2026-10-16)
- Landing page premium multilingue em /cozinha (PT-PT padrão + DE/FR/ES, seletor elegante, idioma do navegador sugerido): hero de impacto ("A cozinha com que sempre sonhou. Em 15 dias úteis."), galeria horizontal deslizante com 6 modelos (Natural, Contemporânea, Minimalista, Clássica moderna, Urbana, Sofisticada) com lupa/ampliação e badge "Imagem de inspiração", botão individual "Quero saber mais sobre esta cozinha" por modelo, secção "Encontrou a cozinha ideal?" com seleção persistente, campanha 15 dias úteis (condições honestas, sem promessas de descontos/escrow), processo em 4 etapas, Sobre (Jardel Silveira + links oficiais), formulário com RGPD + consentimento comercial opcional separado + honeypot anti-spam + UTM, banner de cookies com aceitar/rejeitar/configurar (PostHog só carrega após consentimento de análise; Meta Pixel preparado e sujeito a consentimento), Políticas de Privacidade e Cookies em 4 idiomas, footer com contactos oficiais (+351 930 636 700, geral@mognuscompany.com, Estrada de Vale Judeu 8, Loulé; Maps, Instagram, site) e logótipo oficial (ficheiro original do cliente).
- Painel administrativo privado em /cozinha/admin: autenticação real JWT (bcrypt, cookies httpOnly, brute-force 5 tentativas/15min, recuperação por token), métricas (visitas, únicos, pedidos, conversão, por dia/modelo/idioma/estado/origem, filtros), CRM (estados Novo→Contactado→Em avaliação→Proposta→Cliente + Sem resposta/Não convertido/Arquivado, pesquisa, notas internas, export CSV), gestão de utilizadores (criar/revogar).
- Credenciais de teste: /app/memory/test_credentials.md (admin@mognuscompany.com / Mognus#2026-Cozinhas).
- Vídeo: conforme decisão do cliente, NÃO vai na landing (fica só na publicação do Instagram).
- Domínio próprio (ex.: cozinhas.mognuscompany.com): a ligar posteriormente pelo cliente.

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
