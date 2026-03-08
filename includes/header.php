  <!-- ============================================================
       NAVBAR
       ============================================================ -->
  <nav class="navbar" role="navigation" aria-label="Navegação principal">
    <div class="container">
      <div class="navbar__inner">
        <a href="./" class="navbar__logo"><img src="images/JPeUne.svg" alt="JPe UNE"></a>

        <div class="navbar__links">
          <a href="./">Home</a>
          <a href="quem-somos">Quem Somos</a>

          <div class="nav-dropdown">
            <button class="nav-dropdown__toggle" aria-haspopup="true" aria-expanded="false">
              Serviços
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="nav-dropdown__menu" role="menu">
              <a href="servicos" role="menuitem">Todos os Serviços</a>
              <a href="celula-de-acordos" role="menuitem">Célula de Acordos</a>
              <a href="diagnostico-estrategico" role="menuitem">Diagnóstico Estratégico</a>
              <a href="integracao-dados-estrategia" role="menuitem">Integração de Dados</a>
              <a href="gestao-de-ciclos" role="menuitem">Gestão de Ciclos</a>
            </div>
          </div>

          <a href="diferenciais">Diferenciais</a>
          <a href="contato">Contato</a>
        </div>

        <div class="navbar__cta">
          <a href="contato" class="btn btn-gold">Solicitar diagnóstico</a>
        </div>

        <button class="navbar__hamburger" aria-label="Abrir menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div class="navbar__mobile" role="dialog" aria-label="Menu mobile">
    <a href="./">Home</a>
    <a href="quem-somos">Quem Somos</a>

    <button class="mobile-dropdown__toggle" aria-expanded="false">
      Serviços
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="mobile-dropdown__sub">
      <a href="servicos">Todos os Serviços</a>
      <a href="celula-de-acordos">Célula de Acordos</a>
      <a href="diagnostico-estrategico">Diagnóstico Estratégico</a>
      <a href="integracao-dados-estrategia">Integração de Dados</a>
      <a href="gestao-de-ciclos">Gestão de Ciclos</a>
    </div>

    <a href="diferenciais">Diferenciais</a>
    <a href="contato">Contato</a>
    <a href="contato" class="btn btn-gold">Solicitar diagnóstico</a>
  </div>
