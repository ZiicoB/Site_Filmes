document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".cabecalho");
  const menuBtn = document.querySelector(".cabecalho__menu-btn");
  const menuPanel = document.querySelector("#menu-principal");
  const backToTopBtn = document.querySelector(".voltar__topo");

  // Menu mobile
  if (menuBtn && menuPanel) {
    const closeMenu = () => {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Abrir menu de navegação");
      menuPanel.classList.remove("is-open");
    };

    menuBtn.addEventListener("click", () => {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Abrir menu de navegação" : "Fechar menu de navegação");
      menuPanel.classList.toggle("is-open", !isOpen);
    });

    menuPanel.querySelectorAll("a, button").forEach((item) => {
      item.addEventListener("click", closeMenu);
    });
  }

  // Cabeçalho e botão voltar ao topo ao rolar
  const handleScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 24);
    }
    if (backToTopBtn) {
      backToTopBtn.hidden = y < 420;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Alternância Mensal / Anual na seção de planos
  let currentBilling = "mensal";
  const toggleButtons = document.querySelectorAll(".toggle__btn");
  const priceValues = document.querySelectorAll(".plano__valor");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const billing = btn.dataset.billing;
      if (!billing || billing === currentBilling) return;
      currentBilling = billing;

      toggleButtons.forEach((item) => {
        const active = item === btn;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      priceValues.forEach((el) => {
        const nextPrice = el.dataset[billing];
        if (nextPrice) {
          el.textContent = nextPrice;
        }
      });
    });
  });

  // Modal de assinatura e informações
  const backdrop = document.querySelector("#modal-backdrop");
  const closeBtn = document.querySelector(".modal__fechar");
  const modalTag = document.querySelector("#modal-tag");
  const modalTitle = document.querySelector("#modal-titulo");
  const modalDesc = document.querySelector("#modal-descricao");
  const modalForm = document.querySelector("#modal-form");
  const modalSuccess = document.querySelector("#modal-sucesso");
  const modalSuccessText = document.querySelector("#modal-sucesso-texto");
  const modalOkBtn = document.querySelector("#modal-ok");
  let lastFocusedElement = null;
  let activePlanName = "Premium 4K";

  const infoContent = {
    idiomas: {
      tag: "Preferências",
      title: "Idiomas disponíveis",
      desc: "O Filmes+ oferece áudio original e dublagem em Português (BR), Inglês e Espanhol, além de legendas personalizáveis."
    },
    contrato: {
      tag: "Termos de uso",
      title: "Contrato de assinatura",
      desc: "Assinatura mensal ou anual com renovação automática e cancelamento livre a qualquer momento, sem multa contratual."
    },
    privacidade: {
      tag: "Segurança",
      title: "Política de privacidade",
      desc: "Seus dados de perfil e preferências de exibição são usados apenas para recomendações personalizadas e segurança da conta."
    },
    lgpd: {
      tag: "LGPD",
      title: "Proteção de dados no Brasil",
      desc: "Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), garantimos transparência, acesso e exclusão dos seus dados."
    },
    colaboradores: {
      tag: "Créditos",
      title: "Nossos colaboradores",
      desc: "Projeto desenvolvido por Adriano Barnard (07/2025) para prática de HTML5, CSS3 e JavaScript, com artes geradas por IA e editadas no Photoshop."
    }
  };

  const openModal = ({ tag, title, desc, showForm }) => {
    if (!backdrop) return;
    lastFocusedElement = document.activeElement;
    modalTag.textContent = tag;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalForm.hidden = !showForm;
    modalSuccess.hidden = true;
    modalForm.reset();
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  };

  const closeModal = () => {
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  document.querySelectorAll("[data-open-plan]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activePlanName = btn.dataset.openPlan || "Premium 4K";
      const cycleText = currentBilling === "anual" ? "cobrança anual (-20%)" : "cobrança mensal";
      openModal({
        tag: "Assinatura Filmes+",
        title: `Plano ${activePlanName}`,
        desc: `Você selecionou o plano ${activePlanName} (${cycleText}). Preencha seus dados abaixo para simular a ativação.`,
        showForm: true
      });
    });
  });

  document.querySelectorAll("[data-info-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.infoModal;
      const item = infoContent[key];
      if (!item) return;
      openModal({
        tag: item.tag,
        title: item.title,
        desc: item.desc,
        showForm: false
      });
    });
  });

  modalForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(modalForm);
    const nome = String(formData.get("nome") || "").trim();
    modalForm.hidden = true;
    modalSuccess.hidden = false;
    modalSuccessText.textContent = `Tudo pronto, ${nome}! A simulação do plano ${activePlanName} foi confirmada com sucesso. Aproveite o Filmes+!`;
    modalOkBtn?.focus();
  });

  closeBtn?.addEventListener("click", closeModal);
  modalOkBtn?.addEventListener("click", closeModal);

  backdrop?.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      if (menuBtn?.getAttribute("aria-expanded") === "true") {
        menuBtn.click();
      }
    }
  });
});
