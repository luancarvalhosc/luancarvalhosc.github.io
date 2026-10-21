/* Envio dos formularios sem WordPress: intercepta o submit dos forms do Elementor
   e entrega via FormSubmit (https://formsubmit.co) no e-mail do Luan. */
(function () {
  var DESTINO = 'https://formsubmit.co/ajax/luancarvalhosc@gmail.com';

  function rotulo(nome) {
    var n = (nome || '').replace(/^form_fields\[(.+)\]$/, '$1');
    var mapa = { name: 'Nome', email: 'E-mail', message: 'Mensagem', assunto: 'Assunto' };
    return mapa[n] || n;
  }

  function aviso(form, texto, ok) {
    var el = form.querySelector('.sx-form-aviso');
    if (!el) {
      el = document.createElement('div');
      el.className = 'sx-form-aviso';
      el.style.cssText = 'margin-top:12px;padding:10px 14px;font-weight:700;text-align:center;';
      form.appendChild(el);
    }
    el.style.background = ok ? '#1d7a34' : '#8a1c1c';
    el.style.color = '#fff';
    el.textContent = texto;
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest && e.target.closest('form');
    if (!form || !form.querySelector('.elementor-field-type-submit, [class*="elementor-field"]')) return;
    e.preventDefault();
    e.stopPropagation();

    var dados = { _subject: 'Contato pelo site luancarvalho.com', _template: 'table' };
    new FormData(form).forEach(function (valor, chave) {
      if (valor && !/^form_id|^post_id|^referer_title|^queried_id|^action$/.test(chave)) {
        dados[rotulo(chave)] = valor;
      }
    });

    var botao = form.querySelector('button[type="submit"]');
    var textoOriginal = botao ? botao.textContent : '';
    if (botao) { botao.disabled = true; botao.textContent = 'Enviando…'; }

    fetch(DESTINO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r && (r.success === 'true' || r.success === true)) {
          aviso(form, 'Mensagem enviada! Valeu 🤘', true);
          form.reset();
        } else {
          aviso(form, 'Não foi possível enviar. Chama no direct: @luancarvalho', false);
        }
      })
      .catch(function () {
        aviso(form, 'Não foi possível enviar. Chama no direct: @luancarvalho', false);
      })
      .finally(function () {
        if (botao) { botao.disabled = false; botao.textContent = textoOriginal; }
      });
  }, true);
})();
