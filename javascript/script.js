const gerarUtmButton = document.querySelector('#gerarUTM');

function gerarUTM() {
  const baseUrls = [
    document.getElementById('baseUrl1').value.trim(),
    document.getElementById('baseUrl2').value.trim(),
    document.getElementById('baseUrl3').value.trim(),
    document.getElementById('baseUrl4').value.trim(),
    document.getElementById('baseUrl5').value.trim()
  ].filter(url => url !== "");

  const source = document.getElementById('utmSource').value.trim();
  const medium = document.getElementById('utmMedium').value.trim();
  const campaign = document.getElementById('utmCampaign').value.trim();
  const campaignId = document.getElementById('utm_id').value;
  const term = document.getElementById('utmTerm').value.trim();
  const content = document.getElementById('utmContent').value.trim();
  const campaignContent = document.getElementById('utm_content').value.trim(); 
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

      const finalUrl = url.toString();
      resultados.push(finalUrl);
      salvarNoHistorico(finalUrl);
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
  outputDiv.innerHTML = resultados.map(link => `
    <div class="link-item">
      <span class="link-copy">${link}</span>
      <span class="copy-icon" data-link="${link}" title="Copiar">📋</span>
    </div>
  `).join('');
  exibirHistorico();
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('link-copy') || e.target.classList.contains('copy-icon')) {
    const texto = e.target.dataset.link || e.target.textContent;
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

function salvarNoHistorico(link) {
  let historico = JSON.parse(localStorage.getItem('historicoUTM')) || [];
  if (!historico.includes(link)) {
    historico.push(link);
    localStorage.setItem('historicoUTM', JSON.stringify(historico));
  }
}

function exibirHistorico() {
  const historicoContainer = document.querySelector('.container-history');
  const historico = JSON.parse(localStorage.getItem('historicoUTM')) || [];

  historicoContainer.innerHTML = '<h2>Links criados</h2>'; // limpa e repõe título

  if (historico.length === 0) {
    historicoContainer.innerHTML += '<p>Sem links no histórico ainda.</p>';
    return;
  }

  const lista = historico.map(link => `
    <div class="link-item">
      <span class="link-copy">${link}</span>
      <span class="copy-icon" data-link="${link}" title="Copiar">📋</span>
    </div>
  `).join('');

  historicoContainer.innerHTML += lista;
}

document.addEventListener('DOMContentLoaded', () => {
  gerarUtmButton.addEventListener('click', gerarUTM);
  exibirHistorico();

  const btnLimpar = document.getElementById('limparHistorico');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      Swal.fire({
        title: 'Tem certeza?',
        text: "Isso vai apagar todos os links salvos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, apagar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('historicoUTM');
          exibirHistorico();
        }
      });
    });
  }
});
