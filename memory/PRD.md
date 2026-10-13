# PRD — MOGNU'S · Atelier de Colchões e Camas de Luxo

## Problema original (verbatim)
"Quero que você insira no meu site todas as imagens dos produtos e seus respectivos preços que estão no site que vou enviar, mantendo o layout e o estilo do meu site atual. Não inclua imagens duplicadas, mesmo que apareçam repetidas no site de origem. Mantenha cada produto associado ao preço correto. Melhore bastante a qualidade das imagens... Inclua a marca MOGNU'S nos móveis... Disponibilize lupa e ampliação nas imagens dos produtos... Antes de começar, aguarde as referências que vou enviar."

## Referências recebidas
- Vídeo do site de origem: eu.savoirbeds.com (Savoir Beds) — catálogo de colchões de luxo.
- Fotos de referência: cama em madeira com placa de latão gravada "Mognu's" (aplicação da marca) e estilo editorial de roupa de cama.

## Decisões tomadas (defaults aplicados)
- Fonte de dados: API pública Shopify do site de origem (eu.savoirbeds.com), extraída em 2026-10-13 (23 produtos do núcleo de luxo: 6 colchões, 6 conjuntos de cama, 6 toppers, 5 travesseiros). Preços exatos em EUR (€), formato "a partir de".
- Moeda: € conforme o site de origem (usuário não respondeu a pergunta de moeda).
- Espaço de trabalho estava vazio (template padrão): o site foi construído do zero seguindo as referências enviadas.
- Escopo de imagens: 30 fotografias geradas por IA (Gemini 3.1 Flash Image) em estilo consistente de ateliê de luxo (nogueira, latão, luz quente) — nenhuma duplicada. Cama-de-roupas/lençóis/protetores e 43 designs sob medida (sem preço) do site de origem ficaram de fora desta fase.

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
