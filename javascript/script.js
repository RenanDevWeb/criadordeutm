const gerarUtmButton = document.querySelector('#gerarUTM');

function gerarUTM() {
  const baseUrls = [
    document.getElementById('baseUrl1').value.trim(),
    document.getElementById('baseUrl2').value.trim(),
    document.getElementById('baseUrl3').value.trim(),
    document.getElementById('baseUrl4').value.trim(),
    document.getElementById('baseUrl5').value.trim()
  ].filter(url => url !== ""); // remove vazios

  const source = document.getElementById('utmSource').value.trim();
  const medium = document.getElementById('utmMedium').value.trim();
  const campaign = document.getElementById('utmCampaign').value.trim();
  console.log(campaign);
  const campaignId = document.getElementById('utm_id').value;
  console.log(campaignId); // novo campo
  const term = document.getElementById('utmTerm').value.trim();
  const content = document.getElementById('utmContent').value.trim(); // campo existente
  const campaignContent = document.getElementById('utm_content').value.trim(); 
  console.log(campaignContent);// novo campo alternativo
  const pmkt = document.getElementById('pmkt').value;

  if (baseUrls.length === 0 || !source || !medium) {
    Swal.fire({
      title: 'Erro!',
      text: "Preencha pelo menos uma URL base + os campos obrigatórios: source e medium.",
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  let resultados = [];

  for (let baseUrl of baseUrls) {
    if (!/^https?:\/\//i.test(baseUrl)) {
      baseUrl = 'https://' + baseUrl;
    }

    try {
      const url = new URL(baseUrl);

      url.searchParams.set('utm_source', source);
      url.searchParams.set('utm_medium', medium);
      if (campaign) url.searchParams.set('utm_campaign', campaign);
      if (campaignId) url.searchParams.set('utm_id', campaignId);
      if (term) url.searchParams.set('utm_term', term);
      if (content) {
        url.searchParams.set('utm_content', content);
      } else if (campaignContent) {
        url.searchParams.set('utm_content', campaignContent);
      }
      if (pmkt) url.searchParams.set('pmkt', pmkt);

      resultados.push(url.toString());
    } catch (error) {
      resultados.push(`❌ URL inválida: ${baseUrl}`);
    }
  }

  Swal.fire({
    title: 'Link(s) gerado com sucesso!',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  });

  const outputDiv = document.getElementById('urlResultado');
  // outputDiv.innerHTML = resultados.map(link => `<div class="link-copy">${link}</div>`).join('');
outputDiv.innerHTML = resultados.map(link => `
  <div class="link-item">
    <span class="link-copy">${link}</span>
    <span class="copy-icon" data-link="${link}" title="Copiar">📋</span>
  </div>
`).join('');

}

// Copiar URL ao clicar
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('link-copy')) {
    const texto = e.target.textContent;
    copiarTexto(texto);
  }
});

function copiarTexto(texto) {
  navigator.clipboard.writeText(texto)
    .then(() => {
      Swal.fire({
        title: 'Copiado!',
        text: 'A URL foi copiada para a área de transferência.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    })
    .catch(err => {
      Swal.fire({
        title: 'Erro',
        text: 'Não foi possível copiar.',
        icon: 'error'
      });
    });
}

gerarUtmButton.addEventListener('click', gerarUTM);
