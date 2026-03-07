  <!-- ============================================================
       NAVBAR
       ============================================================ -->
  <nav class="navbar" role="navigation" aria-label="Navegação principal">
    <div class="container">
      <div class="navbar__inner">
        <a href="index.php" class="navbar__logo"><img src="images/JPeUne.svg" alt="JPe UNE"></a>

        <div class="navbar__links">
          <a href="index.php">Home</a>
          <a href="quem-somos.php">Quem Somos</a>

          <div class="nav-dropdown">
            <button class="nav-dropdown__toggle" aria-haspopup="true" aria-expanded="false">
              Serviços
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="nav-dropdown__menu" role="menu">
              <a href="servicos.php" role="menuitem">Todos os Serviços</a>
              <a href="celula-de-acordos.php" role="menuitem">Célula de Acordos</a>
              <a href="diagnostico-estrategico.php" role="menuitem">Diagnóstico Estratégico</a>
              <a href="integracao-dados-estrategia.php" role="menuitem">Integração de Dados</a>
              <a href="gestao-de-ciclos.php" role="menuitem">Gestão de Ciclos</a>
            </div>
          </div>

          <a href="diferenciais.php">Diferenciais</a>
          <a href="contato.php">Contato</a>
        </div>

        <div class="navbar__cta">
          <a href="contato.php" class="btn btn-gold">Solicitar diagnóstico</a>
        </div>

        <button class="navbar__hamburger" aria-label="Abrir menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div class="navbar__mobile" role="dialog" aria-label="Menu mobile">
    <a href="index.php">Home</a>
    <a href="quem-somos.php">Quem Somos</a>

    <button class="mobile-dropdown__toggle" aria-expanded="false">
      Serviços
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="mobile-dropdown__sub">
      <a href="servicos.php">Todos os Serviços</a>
      <a href="celula-de-acordos.php">Célula de Acordos</a>
      <a href="diagnostico-estrategico.php">Diagnóstico Estratégico</a>
      <a href="integracao-dados-estrategia.php">Integração de Dados</a>
      <a href="gestao-de-ciclos.php">Gestão de Ciclos</a>
    </div>

    <a href="diferenciais.php">Diferenciais</a>
    <a href="contato.php">Contato</a>
    <a href="contato.php" class="btn btn-gold">Solicitar diagnóstico</a>
  </div>
