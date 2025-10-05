// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

// TRINIO script start
// This script is owned by Trinio, please do not modify it without consent
function trinioInitialize() {
  var TrinioPluginVTEXInitializer = (function (o) {
    "use strict";
    var k = Object.defineProperty;
    var T = (o, i, s) =>
      i in o
        ? k(o, i, { enumerable: !0, configurable: !0, writable: !0, value: s })
        : (o[i] = s);
    var u = (o, i, s) => (T(o, typeof i != "symbol" ? i + "" : i, s), s);
    function i(n) {
      if (!n || typeof n != "function")
        throw new TypeError("callback must be a function");
      const t = document.readyState;
      (t === "interactive" || t === "complete") && document.body
        ? n()
        : document.addEventListener("DOMContentLoaded", n);
    }
    const s = "trinio-smart-checkout-styles";
    function m(n) {
      const t = document.getElementById(s),
        e = t == null ? void 0 : t.sheet;
      e && e.insertRule(n, e.cssRules.length);
    }
    function y(n) {
      const t = document.getElementById(s);
      if (t) {
        const e = t.sheet;
        if (e != null && e.cssRules) {
          for (let r = 0; r < e.cssRules.length; r++)
            if (e.cssRules[r].selectorText === `.${n}`) {
              e.deleteRule(r);
              return;
            }
        }
      }
    }
    function b() {
      return `
      .trinio-checkout-button--disabled {
        color: transparent !important;
        text-shadow: none !important;
        font-size: 12px !important;
        pointer-events: none;
      }
      .trinio-spinner {
        position: relative;
        overflow: hidden;
      }
      .trinio-spinner::after {
        content: "" !important;
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid transparent;
        animation: trinio-spin 0.9s linear infinite;
      }
      .trinio-spinner:before {
        content: "" !important;
      }
      @keyframes trinio-spin {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }
    `;
    }
    class f {
      constructor(t) {
        u(this, "checkoutButtons", []);
        u(this, "injectTrinioHeaderStyles", () => {
          const t = document.createElement("style");
          t.setAttribute("id", s),
            t.setAttribute("type", "text/css"),
            (t.textContent = b()),
            document.head.appendChild(t);
        });
        u(this, "disableCheckoutButtons", () => {
          this.checkoutButtons.forEach((t, e) => {
            const r = `trinio-spinner-color-${e}`,
              a = window.getComputedStyle(t).color,
              l = `
      .${r}::after {
        border-color: ${a} ${a} ${a} transparent;
      }
      `;
            m(l),
              t.setAttribute("disabled", "true"),
              t.classList.add(
                "trinio-spinner",
                "trinio-checkout-button--disabled",
                r
              );
          }),
            setTimeout(() => {
              this.enableCheckoutButtons();
            }, 6e3);
        });
        u(this, "enableCheckoutButtons", () => {
          this.checkoutButtons.forEach((t, e) => {
            t.removeAttribute("disabled"),
              t.classList.remove(
                "trinio-spinner",
                "trinio-checkout-button--disabled",
                `trinio-spinner-color-${e}`
              ),
              y(`trinio-spinner-color-${e}::after`);
          });
        });
        u(this, "init", async () => {
          try {
            const t = await this.gatherAllCheckoutButtons();
            if (!t.length) return;
            (this.checkoutButtons = t), this.disableCheckoutButtons();
          } catch (t) {
            console.log("[Trinio-Initializer] ", t);
          }
        });
        (this.vtexPlugin = t), this.injectTrinioHeaderStyles();
      }
      async gatherAllCheckoutButtons() {
        const {
            btnCheckoutQuantity: t,
            btnCheckoutRetryAttempt: e = 3,
            enableExponentialBackOffRetry: r,
          } = this.vtexPlugin.options,
          a = [
            this.vtexPlugin.options.btnCheckoutIdOnCart,
            ...this.vtexPlugin.options.btnCheckoutIds,
          ],
          l = async (d = 0) => {
            const C = a
                .map((c) =>
                  Array.from(document.querySelectorAll(`[id="${c}"]`))
                )
                .reduce((c, p) => c.concat(p), []),
              g = (this.vtexPlugin.options.btnCheckoutClasses || [])
                .map((c) => Array.from(document.querySelectorAll(`.${c}`)))
                .reduce((c, p) => c.concat(p), []),
              h = [...C, ...g];
            if ((t ? h.length === t : h.length > 0) || d >= e) return h;
            const B = r ? 100 * Math.pow(2, d + 1) : 200;
            return await new Promise((c) => setTimeout(c, B)), l(d + 1);
          };
        return await l();
      }
    }
    return (
      i(() => {
        const n = window.TRINIO_PLUGIN_CONFIG;
        try {
          (window.TrinioVTEXInitializer = new f(n)),
            window.TrinioVTEXInitializer.init();
        } catch (t) {
          console.log(t);
        }
      }),
      (o.TrinioVTEXInitializer = f),
      Object.defineProperties(o, {
        __esModule: { value: !0 },
        [Symbol.toStringTag]: { value: "Module" },
      }),
      o
    );
  })({});
}
const BASE_URL = "cdn.trinio.co";
function setPluginScript() {
  const scriptPlugin = document.createElement("script");
  scriptPlugin.src = `https://${BASE_URL}/static/trinio-plugin-vtex.iife.js`;
  scriptPlugin.async = true;
  document.body.appendChild(scriptPlugin);
}
function setCssScript() {
  const linkStylesheetTrinioCss = document.createElement("link");
  linkStylesheetTrinioCss.rel = "stylesheet";
  linkStylesheetTrinioCss.type = "text/css";
  linkStylesheetTrinioCss.className = "override_link";
  linkStylesheetTrinioCss.href = `https://${BASE_URL}/static/css/style.css`;
  document.head.appendChild(linkStylesheetTrinioCss);
}

function getSellerCode(orderForm) {
  const sellerCode = orderForm?.marketingData?.utmCampaign;

  if (!sellerCode) {
    return null;
  }

  const numericCode = parseInt(sellerCode);

  if (isNaN(numericCode)) {
    console.warn("[TRINIO] Código do seller não é numérico:", sellerCode);
    return null;
  }

  return numericCode;
}

window.TRINIO_PLUGIN_CONFIG = {
  merchantId: "01K2FSNFHRQ7DFM6AWXN6DQAB4",
  options: {
    checkoutPollingInterval: 100,
    btnCheckoutClasses: [],
    btnCheckoutIds: [],
    btnCheckoutIdOnCart: "cart-to-orderform",
    btnCheckoutQuantity: 2,
    enableExponentialBackOffRetry: true,
    defaultCashbackProvider: "CRM_BONUS",
    getSellerCode: function (orderForm) {
      const sellerCode = orderForm?.marketingData?.utmCampaign;

      if (!sellerCode) {
        return null;
      }

      const numericCode = parseInt(sellerCode);
      return isNaN(numericCode) ? null : numericCode;
    },
  },
};
trinioInitialize();
setPluginScript();
setCssScript();
console.log("[TRINIO VTEX] all js and css add to DOM");
// TRINIO script end

var c =
  '\n  <div class="checkout-withdraw">\n    <h3>Ganhe 10% de desconto + Entrega grátis !</h3>\n\n  </div>\n';
function u() {
  $(document).ready(function () {
    0 == $(".checkout-withdraw").length && $(".srp-toggle__pickup").append(c);
  }),
    $(document).on("submit", ".srp-postal-code__form", function () {
      $(document).ajaxComplete(function () {
        0 == $(".checkout-withdraw").length &&
          $(".srp-toggle__pickup").append(c);
      });
    });
}
u();

$(window).load(async function () {
  await setTimeout(u, 3000);
  //	await setTimeout(reCAPTCHA, 3);

  $("#shipping-calculate-link").on("click", async function () {
    console.log("clicou");

    await setTimeout(appendSellerCode, 2000);
    await setTimeout(u, 2000);
  });

  u();
});

var isFieldHidden = false;

const calculateFrete = async function () {
  let orderForm = null;
  let subTotal = null;
  let desconto = 0;
  let freteGratis = 400;
  let restante = null;

  await vtexjs.checkout.getOrderForm().then((orderFormo) => {
    orderForm = orderFormo;
    subTotal = orderForm.totalizers[0].value / 100;
    let discountTot = orderForm.totalizers.find((x) => x.id == "Discounts");
    if (discountTot) {
      desconto = discountTot.value / 100;
    }
  });

  if (document.getElementById("freteGratis") != null) {
    document.getElementById("freteGratis").remove();
    //checa se tem codigo de vendedor aplicado e, se sim, nao adiciona a mensagem de frete
    if (
      orderForm.marketingData &&
      orderForm.marketingData.utmCampaign &&
      !isNaN(parseInt(orderForm.marketingData.utmCampaign))
    ) {
      return;
    }
  }

  if (
    subTotal + desconto >= freteGratis ||
    (orderForm.marketingData && orderForm.marketingData.utmCampaign)
  ) {
    document
      .getElementsByClassName("table")[1]
      .insertAdjacentHTML(
        "beforebegin",
        '<div id="freteGratis" style="text-align: end;margin-bottom: 1rem;">Oba, você ganhou frete grátis!</div>'
      );
  } else {
    restante = freteGratis - (subTotal + desconto);
    if (restante > 0) {
      document
        .getElementsByClassName("table")[1]
        .insertAdjacentHTML(
          "beforebegin",
          "<div id='freteGratis' style='text-align: end;margin-bottom: 1rem;'>Faltam apenas R$ " +
            restante.toFixed(2) +
            " para ganhar <b>frete grátis</b></div>"
        );
    }
  }
};

const appendSellerCode = async function () {
  let attempts = 0;
  let maxAttempts = 5;
  let interval = 2000;

  const tryAppend = async () => {
    let orderForm = null;

    // Obtém o OrderForm
    await vtexjs.checkout.getOrderForm().then((orderFormo) => {
      orderForm = orderFormo;
      console.log(orderForm);
    });

    console.log(orderForm);

    // Verifica se o seletor existe no DOM
    if ($(".coupon.summary-coupon").length > 0) {
      if (isFieldHidden) {
        $(".coupon.summary-coupon").append(
          `<form class="coupon-form CarrinhoVendedorForm" id="CarrinhoVendedorForm" style="margin-top: 20px" > <fieldset class="coupon-fieldset"> <div data-bind="fadeVisible: isUsingCoupon()" style="display: none"> <p style="text-align:right;"> <label style="font-family:'din', Arial, sans-serif;font-size:15px;text-transform:none !important;font-weight:500;" for="cart-coupon" data-i18n="totalizers.couponCapitalize">Código do vendedor</label></p> <div style="display: flex;align-items: center;gap: 5px;justify-content: end;">${
            orderForm.marketingData &&
            orderForm.marketingData.utmiCampaign &&
            orderForm.marketingData.utmiCampaign &&
            !isNaN(parseInt(orderForm.marketingData.utmiCampaign))
              ? getActualSeller(orderForm.marketingData.utmCampaign)
              : ""
          }<span id="removeVendedorIcon" style="cursor: pointer;" onclick="showVendedorField()">&#10006;</span> </div>`
        );
      } else {
        $(".coupon.summary-coupon").append(
          `<form class="coupon-form CarrinhoVendedorForm" id="CarrinhoVendedorForm" style="margin-top: 20px" > <fieldset class="coupon-fieldset"> <div data-bind="fadeVisible: isUsingCoupon()" style="display: none"> <p style="text-align:right;"> <label style="font-family:'din', Arial, sans-serif;font-size:15px;text-transform:none !important;font-weight:500;" for="cart-coupon" data-i18n="totalizers.couponCapitalize">Código do vendedor</label></p> </div> <p id="vendedor-field" class="coupon-fields"> <span data-bind="visible: !isCouponTyped()"> <input type="text" class="coupon-value input-small CarrinhoVendedorFormField" data-bind="value: couponCode, valueUpdate:'afterkeydown', disable: loadingCoupon()" placeholder="Código" value="${
            orderForm.marketingData &&
            orderForm.marketingData.utmCampaign &&
            orderForm.marketingData &&
            !isNaN(parseInt(orderForm.marketingData.utmCampaign))
              ? orderForm.marketingData.utmCampaign
              : ""
          }" /> <i class="loading-inline icon-spinner icon-spin loading-coupon" data-bind="fadeInlineVisible: loadingCoupon" style="opacity: 0" > <span data-i18n="cart.wait">Por favor, aguarde...</span> </i> <button type="submit" class="btn">Adicionar</button> </span> <span class="info" data-bind="visible: isCouponTyped" style="display: none" > <span data-bind="text: value"></span> <small class="delete" ><a href="javascript:void(0);" id="cart-coupon-remove" data-bind="click: removeCoupon" data-i18n="global.delete" >excluir</a ></small > </span> </p> </div> <p class="coupon-data" data-bind="fadeVisible: !isUsingCoupon()" style="display: block" > <a class="link-coupon-add" href="javascript:void(0);" id="cart-link-coupon-add" data-bind="click: isUsingCoupon" > <span data-i18n="global.add">Adicionar</span> <span data-i18n="totalizers.coupon">cupom de desconto</span> </a> </p> </fieldset> </form> <script> $(".CarrinhoVendedorForm").submit(function (event) { event.preventDefault(); const valueArray = $(".CarrinhoVendedorFormField"); const code = valueArray[1].value; setSellerCode(code); }); $(".buttonRemoveVendedor").click(function () { removeSellerCode(); }); </script>`
        );
      }
    } else if (attempts < maxAttempts) {
      // Seletor não encontrado, tenta novamente após o intervalo
      attempts++;
      console.warn(
        `Seletor .coupon.summary-coupon não encontrado. Tentativa ${attempts} de ${maxAttempts}.`
      );
      setTimeout(tryAppend, interval);
    } else {
      // Número máximo de tentativas atingido
      console.error(
        "Seletor .coupon.summary-coupon não encontrado no DOM após várias tentativas."
      );
    }
  };

  // Inicia a primeira tentativa
  await tryAppend();
};

// const appendSellerCode = async function () {
//   // if (!document.getElementById("CarrinhoVendedorForm")) {
//   let orderForm = null;

//   await vtexjs.checkout.getOrderForm().then((orderFormo) => {
//     orderForm = orderFormo;
//     console.log(orderForm);
//   });

//   console.log(orderForm);

//   if (isFieldHidden) {
//     $(".coupon.summary-coupon").append(
//       `<form class="coupon-form CarrinhoVendedorForm" id="CarrinhoVendedorForm" style="margin-top: 20px" > <fieldset class="coupon-fieldset"> <div data-bind="fadeVisible: isUsingCoupon()" style="display: none"> <p style="text-align:right;"> <label style="font-family:'din', Arial, sans-serif;font-size:15px;text-transform:none !important;font-weight:500;" for="cart-coupon" data-i18n="totalizers.couponCapitalize">Código do vendedor</label></p> <div style="display: flex;align-items: center;gap: 5px;justify-content: end;">${
//         orderForm.marketingData && orderForm.marketingData.utmiCampaign && orderForm.marketingData.utmiCampaign !== 'semcodigo'
//           ? getActualSeller(orderForm.marketingData.utmCampaign)
//           : ""
//       }<span id="removeVendedorIcon" style="cursor: pointer;" onclick="showVendedorField()">&#10006;</span> </div>`
//     );
//   } else {
//     $(".coupon.summary-coupon").append(
//       `<form class="coupon-form CarrinhoVendedorForm" id="CarrinhoVendedorForm" style="margin-top: 20px" > <fieldset class="coupon-fieldset"> <div data-bind="fadeVisible: isUsingCoupon()" style="display: none"> <p style="text-align:right;"> <label style="font-family:'din', Arial, sans-serif;font-size:15px;text-transform:none !important;font-weight:500;" for="cart-coupon" data-i18n="totalizers.couponCapitalize">Código do vendedor</label></p> </div> <p id="vendedor-field" class="coupon-fields"> <span data-bind="visible: !isCouponTyped()"> <input type="text" class="coupon-value input-small CarrinhoVendedorFormField" data-bind="value: couponCode, valueUpdate:'afterkeydown', disable: loadingCoupon()" placeholder="Código" value="${
//         orderForm.marketingData && orderForm.marketingData.utmCampaign && orderForm.marketingData && orderForm.marketingData.utmCampaign != 'semcodigo'
//           ? orderForm.marketingData.utmCampaign
//           : ""
//       }" /> <i class="loading-inline icon-spinner icon-spin loading-coupon" data-bind="fadeInlineVisible: loadingCoupon" style="opacity: 0" > <span data-i18n="cart.wait">Por favor, aguarde...</span> </i> <button type="submit" class="btn">Adicionar</button> </span> <span class="info" data-bind="visible: isCouponTyped" style="display: none" > <span data-bind="text: value"></span> <small class="delete" ><a href="javascript:void(0);" id="cart-coupon-remove" data-bind="click: removeCoupon" data-i18n="global.delete" >excluir</a ></small > </span> </p> </div> <p class="coupon-data" data-bind="fadeVisible: !isUsingCoupon()" style="display: block" > <a class="link-coupon-add" href="javascript:void(0);" id="cart-link-coupon-add" data-bind="click: isUsingCoupon" > <span data-i18n="global.add">Adicionar</span> <span data-i18n="totalizers.coupon">cupom de desconto</span> </a> </p> </fieldset> </form> <script> $(".CarrinhoVendedorForm").submit(function (event) { event.preventDefault(); const valueArray = $(".CarrinhoVendedorFormField"); const code = valueArray[1].value; setSellerCode(code); }); $(".buttonRemoveVendedor").click(function () { removeSellerCode(); }); </script>`
//     );
//   }
//   // }

//   // await setTimeout(appendSellerCode, 3);
// };

$(window).load(async function () {
  await calculateFrete();
  await vtexjs.checkout.getOrderForm().then((orderForm) => {
    if (
      orderForm.marketingData &&
      orderForm.marketingData.utmCampaign &&
      !isNaN(parseInt(orderForm.marketingData.utmCampaign))
    ) {
      isFieldHidden = true;
      if (
        orderForm.marketingData.utmiCampaign == null ||
        isNaN(parseInt(orderForm.marketingData.utmiCampaign))
      ) {
        orderForm.marketingData.utmiCampaign =
          orderForm.marketingData.utmCampaign;
      }
    }
  });
  await appendSellerCode();
  myIntervals();
});

function myIntervals() {
  var caixasExist = setInterval(function () {
    var caixas = document.getElementsByClassName("gift-message-textarea");
    if (caixas != null) {
      for (var i = 0; i < caixas.length; i++) {
        caixas[i].placeholder =
          "Escreva aqui uma mensagem para o seu presenteado.";
      }
      clearInterval(caixasExist);
    }
  }, 1000);

  var mensagemExist = setInterval(function () {
    var mainDiv = document.getElementsByClassName("note-data")[0];
    var div = document
      .getElementsByClassName("note")[0]
      .getElementsByTagName("div")[0];
    if (mainDiv.style.display == "block") {
      mainDiv.style.setProperty("display", "none", "important");
      div.style.setProperty("display", "block", "important");
      document.getElementsByClassName("note-label")[0].style.pointerEvents =
        "none";
      document.getElementById("cart-note").style.width = "240px";
      document.getElementById("cart-note").style.height = "70px";
      clearInterval(mensagemExist);
    }
  }, 1000);

  setInterval(function () {
    if (
      typeof document.getElementsByClassName("payment-discounts-list")[0] !==
        "undefined" &&
      document
        .getElementsByClassName("payment-discounts-list")[0]
        .innerText.includes("Valor") == false
    ) {
      $(".payment-discounts-list").append(
        document.getElementsByClassName("sight")[0].innerText
      );
    }
  }, 1000);
}

// const sellerJSON = [
//   {
//     codigo: "22476",
//     nome: "GABRIEL NUNES",
//     loja: "COPACABNA",
//   },
//   {
//     codigo: "219182",
//     nome: "YAGO P.",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "291156",
//     nome: "RAFAEL PIZA",
//     loja: "ICARAÍ",
//   },
//   {
//     codigo: "215210",
//     nome: "LARISSA",
//     loja: "RIO DESIGN",
//   },
//   {
//     codigo: "215211",
//     nome: "LAYLA",
//     loja: "RIO DESIGN",
//   },
//   {
//     codigo: "219181",
//     nome: "LUANA S.",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "221185",
//     nome: "GABRIEL COSTA",
//     loja: "PLAZA",
//   },
//   {
//     codigo: "24176",
//     nome: "PALOMA DIAS",
//     loja: "BARRA",
//   },
//   {
//     codigo: "24202",
//     nome: "ANA MARIA",
//     loja: "BARRA",
//   },
//   {
//     codigo: "24225",
//     nome: "LUCAS ROSENO",
//     loja: "BARRA",
//   },
//   {
//     codigo: "24239",
//     nome: "BERNARDO MEDEIROS",
//     loja: "BARRA",
//   },
//   {
//     codigo: "24244",
//     nome: "MIKE MOURA",
//     loja: "BARRA",
//   },
//   {
//     codigo: "27219",
//     nome: "SERGIO VALPAÇOS",
//     loja: "BARRA",
//   },
//   {
//     codigo: "281195",
//     nome: "MAYARA G.",
//     loja: "BARRA",
//   },
//   {
//     codigo: "23199",
//     nome: "BEATRIZ LOPES",
//     loja: "CENTRO",
//   },
//   {
//     codigo: "218114",
//     nome: "HELBER SOUZA",
//     loja: "CENTRO",
//   },
//   {
//     codigo: "218117",
//     nome: "LUCAS HERMIDA",
//     loja: "CENTRO",
//   },
//   {
//     codigo: "22464",
//     nome: "GABRIEL SILVA",
//     loja: "COPACABANA",
//   },
//   {
//     codigo: "22473",
//     nome: "CAIO RODRIGUES",
//     loja: "COPACABANA",
//   },
//   {
//     codigo: "22465",
//     nome: "VALENTINA",
//     loja: "COPACABANA",
//   },
//   {
//     codigo: "22472",
//     nome: "VITORIA",
//     loja: "COPACABANA",
//   },
//   {
//     codigo: "101246",
//     nome: "FABIANO G.",
//     loja: "COPACABANA",
//   },
//   {
//     codigo: "22286",
//     nome: "ARLEY SANTOS",
//     loja: "DOWNTOWN",
//   },
//   {
//     codigo: "101279",
//     nome: "BRUNO LAPA",
//     loja: "DOWNTOWN",
//   },
//   {
//     codigo: "219166",
//     nome: "LEONARDO S.",
//     loja: "DOWNTOWN",
//   },
//   {
//     codigo: "281202",
//     nome: "MARIANA A.",
//     loja: "DOWNTOWN",
//   },
//   {
//     codigo: "281204",
//     nome: "FERNANDA DUARTE",
//     loja: "DOWNTOWN",
//   },
//   {
//     codigo: "281206",
//     nome: "THALLES WESLEY",
//     loja: "DOWNTOWN",
//   },
//   {
//     codigo: "235",
//     nome: "ROGERIA PACHECO",
//     loja: "E-COM",
//   },
//   {
//     codigo: "2216",
//     nome: "RAFAEL BALBINO",
//     loja: "E-COM",
//   },
//   {
//     codigo: "101243",
//     nome: "E-COMMERCE",
//     loja: "E-COM",
//   },
//   {
//     codigo: "213132",
//     nome: "JULIA BOUERI",
//     loja: "E-COM",
//   },
//   {
//     codigo: "219152",
//     nome: "AYANNY LOPES",
//     loja: "E-COM",
//   },
//   {
//     codigo: "221146",
//     nome: "RODRIGO LUZ",
//     loja: "ICARAI",
//   },
//   {
//     codigo: "291147",
//     nome: "VITOR CALOR",
//     loja: "ICARAI",
//   },
//   {
//     codigo: "291155",
//     nome: "Rebeca Scop",
//     loja: "ICARAI",
//   },
//   {
//     codigo: "291152",
//     nome: "VINICIUS LYRA",
//     loja: "ICARAI",
//   },
//   {
//     codigo: "291153",
//     nome: "DANILO LIMA",
//     loja: "ICARAI",
//   },
//   {
//     codigo: "291154",
//     nome: "IZABELLA",
//     loja: "ICARAI",
//   },
//   {
//     codigo: "22474",
//     nome: "AMANDA MARTINS",
//     loja: "IPANEMA ",
//   },
//   {
//     codigo: "2101152",
//     nome: "KAIA S.",
//     loja: "IPANEMA ",
//   },
//   {
//     codigo: "2101158",
//     nome: "JOSE VITOR",
//     loja: "IPANEMA ",
//   },
//   {
//     codigo: "2101162",
//     nome: "RODRIGO P.",
//     loja: "IPANEMA ",
//   },
//   {
//     codigo: "2101165",
//     nome: "PAULO T.",
//     loja: "IPANEMA ",
//   },
//   {
//     codigo: "22287",
//     nome: "MICAEL N.",
//     loja: "METROPOLITANO",
//   },
//   {
//     codigo: "215188",
//     nome: "JOAO GALINDO",
//     loja: "Barra",
//   },
//   {
//     codigo: "281193",
//     nome: "ÁLEF B.",
//     loja: "METROPOLITANO",
//   },
//   {
//     codigo: "281205",
//     nome: "ALLAN VIDAL",
//     loja: "METROPOLITANO",
//   },
//   {
//     codigo: "23208",
//     nome: "RICARDO S.",
//     loja: "NOVA AMÉRICA",
//   },
//   {
//     codigo: "23210",
//     nome: "JONAS M. ",
//     loja: "NOVA AMÉRICA",
//   },
//   {
//     codigo: "23211",
//     nome: "LEONARDO L.",
//     loja: "Metropolitano",
//   },
//   {
//     codigo: "23212",
//     nome: "CAROLINA G.",
//     loja: "NOVA AMÉRICA",
//   },
//   {
//     codigo: "23213",
//     nome: "ARTHUR B.",
//     loja: "NOVA AMÉRICA",
//   },
//   {
//     codigo: "73",
//     nome: "JEAN EVARISTO",
//     loja: "PLAZA",
//   },
//  // {
//  //  codigo: "221171",
//  // nome: "VITOR HUGO",
//  //   loja: "PLAZA",
//  // },
//   {
//     codigo: "221175",
//     nome: "NATHALIA OLIVEIRA",
//     loja: "PLAZA",
//   },
//   {
//     codigo: "291128",
//     nome: "LUIS FILIPE",
//     loja: "PLAZA",
//   },
//   {
//     codigo: "21587",
//     nome: "DEIVID ANDRADE",
//     loja: "RIO DESIGN",
//   },
//   {
//     codigo: "24243",
//     nome: "STEPHANY O.",
//     loja: "RIO DESIGN",
//   },
//   {
//     codigo: "215199",
//     nome: "ÍCARO G.",
//     loja: "RIO DESIGN",
//   },
//   {
//     codigo: "215208",
//     nome: "VITOR A.",
//     loja: "RIO DESIGN",
//   },
//   {
//     codigo: "2743",
//     nome: "ANTONIO V.",
//     loja: "RIO SUL",
//   },
//   {
//     codigo: "27231",
//     nome: "RITA CARDOSO",
//     loja: "RIO SUL",
//   },
//   {
//     codigo: "27234",
//     nome: "SOLLOHANT M.",
//     loja: "RIO SUL",
//   },
//   {
//     codigo: "27244",
//     nome: "MATHEUS MOAMED",
//     loja: "RIO SUL",
//   },
//   {
//     codigo: "27249",
//     nome: "WILLHIANE",
//     loja: "RIO SUL",
//   },
//   {
//     codigo: "211168",
//     nome: "JULIANA SILVA",
//     loja: "RIO SUL",
//   },
//   {
//     codigo: "23187",
//     nome: "EIDIMUNDO C.",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "213135",
//     nome: "ALEXANDRE TAVARES",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "219169",
//     nome: "MANUELA INACIO",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "219171",
//     nome: "KAIKI RIBEIRO",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "219179",
//     nome: "SHABA",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "219178",
//     nome: "GABRIEL MONTEIRO",
//     loja: "TIJUCA",
//   },
//   {
//     codigo: "101291",
//     nome: "EUDES SOUSA",
//     loja: "LOJINHA",
//   },
//   {
//     codigo: "2141050",
//     nome: "DANIELLE SANTOS",
//     loja: "LOJINHA",
//   },
//     {
//     codigo: "291157",
//     nome: "Adriano Vargas",
//     loja: "Icaraí",
//   },
//       {
//     codigo: "22477",
//     nome: "SYLVIA FEDERICO MORENO",
//     loja: "Copacabana",
//   },
//       {
//     codigo: "281207",
//     nome: "Yan Queiroz",
//     loja: "Downtown",
//   },
//    {
//     codigo: "2217",
//     nome: "Jady Costa",
//     loja: "E-commerce",
//   },
//    {
//     codigo: "218111",
//     nome: "Tiago Garrilha",
//     loja: "Nova América",
//   },
//    {
//     codigo: "23214",
//     nome: "João Carlos",
//     loja: "Nova América",
//   },
//     {
//     codigo: "2218",
//     nome: "Luis André",
//     loja: "Estilo",
//   },
//       {
//     codigo: "291163",
//     nome: "Evellen Oliveira",
//     loja: "Icaraí",
//   },
//     {
//     codigo: "218119",
//     nome: "Danubia Martins",
//     loja: "Centro",
//   },
//   {
//     codigo: "221190",
//     nome: "Raphael Scarpa",
//     loja: "Plaza",
//   },
//   {
//     codigo: "23219",
//     nome: "Thaina Marques",
//     loja: "Nova América",
//   },
//   {
//     codigo: "23218",
//     nome: "Bruno Pires",
//     loja: "Nova América",
//   },
//   {
//     codigo: "2101171",
//     nome: "Pedro Guimarães",
//     loja: "Ipanema",
//   },
//     {
//     codigo: "215213",
//     nome: "Wallace Costa",
//     loja: "Rio Design",
//   },
//     {
//     codigo: "22295",
//     nome: "Gabriel Cardozo",
//     loja: "Metropolitano",
//   },
//   {
//     codigo: "22296",
//     nome: "Vanessa Soares",
//     loja: "Metropolitano",
//   },
//     {
//     codigo: "24251",
//     nome: "Ruan Rabello",
//     loja: "Barra Shopping",
//   },
//     {
//     codigo: "281209",
//     nome: "Larissa Oliveira",
//     loja: "Downtown",
//   },
//     {
//     codigo: "215218",
//     nome: "Tatiana Leal",
//     loja: "Rio Design barra",
//   },

//     {
//     codigo: "281210",
//     nome: "Thaylon Pires",
//     loja: "Downtown",
//   },

//     {
//     codigo: "291164",
//     nome: "Adriana Brum",
//     loja: "Icaraí",
//   },
//    {
//     codigo: "22480",
//     nome: "Fernanda Souza",
//     loja: "Copacabana",
//   },
//     {
//     codigo: "219187",
//     nome: "Felipe B",
//     loja: "Tijuca",
//   },
//    {
//     codigo: "22297",
//     nome: "Raphael Martinez",
//     loja: "Metropolitano",
//   },
//      {
//     codigo: "291164",
//     nome: "Adriana",
//     loja: "Icaraí",
//   },
//   {
//     codigo: "219188",
//     nome: "Anna",
//     loja: "Tijuca",
//   },
//     {
//     codigo: "2101172",
//     nome: "Sabeki Bessa",
//     loja: "Ipanema",
//   },
//       {
//     codigo: "2219",
//     nome: "Guilherme",
//     loja: "E-commerce",
//   },
//    {
//     codigo: "215220",
//     nome: "Lillian",
//     loja: "Rio Design",
//   },
//       {
//     codigo: "215219",
//     nome: "Dennis",
//     loja: "Rio Design",
//   },
//    {
//     codigo: "22481",
//     nome: "Rayssa Vieira",
//     loja: "Copacabana",
//   },
//      {
//     codigo: "281211",
//     nome: "Raphael",
//     loja: "Downtown",
//   },
//      {
//     codigo: "24253",
//     nome: "João Martins",
//     loja: "Barra shopping",
//   },
//        {
//     codigo: "22298",
//     nome: "Gabriela Pita",
//     loja: "Downtown",
//   },
//        {
//     codigo: "22299",
//     nome: "Brandon Quadros",
//     loja: "Metropolitano",
//   },
//     {
//     codigo: "2101173",
//     nome: "John Lopes",
//     loja: "Ipanema",
//   },
//     {
//     codigo: "215221",
//     nome: "Gabriela Casal",
//     loja: "Rio design",
//   },
//    {
//     codigo: "23221",
//     nome: "Isabela Rocha",
//     loja: "Nova América",
//   },
//   {
//     codigo: "23220",
//     nome: "Rodrigo Queiroz",
//     loja: "Nova América",
//   },
//    {
//     codigo: "281212",
//     nome: "João Pedro",
//     loja: "Downtown",
//   },
//    {
//     codigo: "2101174",
//     nome: "Caique Barbosa",
//     loja: "Ipanema",
//   },
//   {
//     codigo: "23222",
//     nome: "Danilo Vinicíus",
//     loja: "Nova América",
//   },
//    {
//     codigo: "218120",
//     nome: "Beatriz Morais",
//     loja: "Centro",
//   },
//    {
//     codigo: "215222",
//     nome: "Pedro Neves",
//     loja: "Rio Design",
//   },
//   {
//     codigo: "101292",
//     nome: "Bia",
//     loja: "Armadillo",
//   },
//   {
//     codigo: "24255",
//     nome: "Matheus Froes",
//     loja: "Barra Shopping",
//   },
//    {
//     codigo: "215223",
//     nome: "Luis Cláudio",
//     loja: "Rio Design",
//   },
//    {
//     codigo: "24254",
//     nome: "Gabriela Feijó",
//     loja: "Barra Shopping",
//   },
//   {
//     codigo: "215224",
//     nome: "Claudio Martins",
//     loja: "Rio Design",
//   },
//    {
//     codigo: "218122",
//     nome: "Vaneça Correia",
//     loja: "Centro",
//   },
//      {
//     codigo: "24256",
//     nome: "Ricardo Carvalho",
//     loja: "Barra shopping",
//   },
//         {
//     codigo: "221195",
//     nome: "Erika Pacheco",
//     loja: "Plaza",
//   },

//    {
//     codigo: "22482",
//     nome: "Gabriel Garcia",
//     loja: "Copacabana",
//   },
//   {
//     codigo: "291165",
//     nome: "Juliana Christine",
//     loja: "Icaraí",
//   },
//    {
//     codigo: "2265",
//     nome: "Brisa Vieira",
//     loja: "Leblon",
//   },
//   {
//     codigo: "2264",
//     nome: "Filipe Silva",
//     loja: "Leblon",
//   },
//    {
//     codigo: "219178",
//     nome: "Gabriel Monteiro",
//     loja: "Leblon",
//   },
//   {
//     codigo: "2263",
//     nome: "João Pedro",
//     loja: "Leblon",
//   },
//   {
//     codigo: "2266",
//     nome: "Lívia Sodré",
//     loja: "Leblon",
//   },
//   {
//     codigo: "281213",
//     nome: "Muricio Tinoco",
//     loja: "Downtown",
//   },
//   {
//     codigo: "27257",
//     nome: "Renan Correia",
//     loja: "Rio Sul",
//   },
//    {
//     codigo: "22483",
//     nome: "Rodrigo Coutinho",
//     loja: "Copacabana",
//   },
//   {
//     codigo: "22484",
//     nome: "Leticia Wirz",
//     loja: "Copacabana",
//   },

//    {
//     codigo: "22110",
//     nome: "Thamires Correa",
//     loja: "Estilo",
//   },
//    {
//     codigo: "101225",
//     nome: "Hilda Lima",
//     loja: "Armadillo",
//   },
//    {
//     codigo: "101229",
//     nome: "Ilana Farias",
//     loja: "Armadillo",
//   },
//    {
//     codigo: "101295",
//     nome: "Isabela Pessoa",
//     loja: "Armadillo",
//   },
//    {
//     codigo: "21611",
//     nome: "Raphael",
//     loja: "Leblon",
//   },
//    {
//     codigo: "219190",
//     nome: "Raphael O.",
//     loja: "Tijuca",
//   },
//   {
//     codigo: "23223",
//     nome: "Lucas Micas",
//     loja: "Nova América",
//   },
//   {
//     codigo: "221201",
//     nome: "Victor Vargas",
//     loja: "Plaza",
//   },
//    {
//     codigo: "219189",
//     nome: "Lara N",
//     loja: "Tijuca",
//   },
//   {
//     codigo: "222103",
//     nome: "Raphael ",
//     loja: "Metropolitano",
//   },
//   {
//     codigo: "222102",
//     nome: "Ehrmerso ",
//     loja: "Metropolitano",
//   },
//   {
//     codigo: "291166",
//     nome: "Luiz Eduardo",
//     loja: "Icaraí",
//   },
//    {
//     codigo: "22612",
//     nome: "Lucas A. Oliveira",
//     loja: "Leblon",
//   },
//    {
//     codigo: "22611",
//     nome: "Raphael",
//     loja: "Leblon",
//   },
//   {
//     codigo: "221202",
//     nome: "Yasmim",
//     loja: "Plaza",
//   },
//   {
//     codigo: "27262",
//     nome: "Thaina Rocha",
//     loja: "Rio Sul",
//   },
//   {
//     codigo: "27263",
//     nome: "Daniel Soares",
//     loja: "Rio Sul",
//   },
//    {
//     codigo: "219194",
//     nome: "Felippe de Santis",
//     loja: "Tijuca",
//   },
//   {
//     codigo: "218123",
//     nome: "Rafael Mattos",
//     loja: "Centro",
//   },
//    {
//     codigo: "22113",
//     nome: "Daniel B",
//     loja: "Estilo",
//   },
//   {
//     codigo: "22112",
//     nome: "Beatriz C.",
//     loja: "Marketing",
//   },
//   {
//     codigo: "22111",
//     nome: "Ana C.",
//     loja: "E-commerce",
//   },
//    {
//     codigo: "221203",
//     nome: "Marcos V.",
//     loja: "Plaza",
//   },
//   {
//     codigo: "281216",
//     nome: "Moisés Paixão",
//     loja: "Downtown",
//   },
//    {
//     codigo: "222104",
//     nome: "Giulia Mena",
//     loja: "Metropolitano",
//   },
//   {
//     codigo: "27265",
//     nome: "Arthur A.",
//     loja: "Rio Sul",
//   },
//    {
//     codigo: "101297",
//     nome: "Myllena Lira",
//     loja: "Metropolitano",
//   },
//   {
//     codigo: "101299",
//     nome: "Flavio Amorim",
//     loja: "Rio Sul",
//   },
//   {
//     codigo: "101298",
//     nome: "Thais Dias",
//     loja: "Rio Sul",
//   }
//   ,
//   {
//     codigo: "22114",
//     nome: "Guilherme S.",
//     loja: "Design",
//   },
//    {
//     codigo: "101301",
//     nome: "Gabriel Ribeiro",
//     loja: "Icaraí",
//   }
//   ,
//    {
//     codigo: "101300",
//     nome: "Rafaela Lourenco",
//     loja: "Icaraí",
//   }
//   ,
//    {
//     codigo: "101302",
//     nome: "Guilherme Gonzaga",
//     loja: "Ipanema ",
//   }
//   ,
//    {
//     codigo: "101304",
//     nome: "Christtyann Gabriel",
//     loja: "Nova América",
//   },
//    {
//     codigo: "101305",
//     nome: "Thiago Leonardo",
//     loja: "Plaza",
//   },
//   {
//     codigo: "101303",
//     nome: "Gabriel Silva",
//     loja: "TJ",
//   },
//     {
//     codigo: "101306",
//     nome: "Alessandro Salguero",
//     loja: "BR",
//   },
//     {
//     codigo: "101307",
//     nome: "Felipe Barbosa",
//     loja: "LB",
//   },

//    {
//     codigo: "101310",
//     nome: "Michael Junger",
//     loja: "Tijuca",
//   }
//   ,
//    {
//     codigo: "101311",
//     nome: "Erico Simplicio",
//     loja: "Metropolitano",
//   }

//    ,
//    {
//     codigo: "101308",
//     nome: "Yasmin Lima",
//     loja: "Ipanema",
//   }

//   ,
//    {
//     codigo: "101312",
//     nome: "Danielle Machado",
//     loja: "Tijuca",
//   }
//   ,
//    {
//     codigo: "101315",
//     nome: "Jeny Isabela",
//     loja: "Rio Sul",
//   }
//   ,
//    {
//     codigo: "101314",
//     nome: "Leonam Rodrigues",
//     loja: "Tijuca",
//   }
//   ,
//    {
//     codigo: "101313",
//     nome: "Caio Fernandes",
//     loja: "Icaraí",
//   }
//   ,
//    {
//     codigo: "101316",
//     nome: "Gabriel Barbosa",
//     loja: "Rio Sul",
//   }
//    ,
//    {
//     codigo: "400014",
//     nome: "Leonardo Lopes",
//     loja: "Barra",
//   }
//      ,
//    {
//     codigo: "190011",
//     nome: "Pedro Luiz da Rocha",
//     loja: "Leblon",
//   }
// ];

const sellerJSON = [
  {
    loja: "Barra Shop.",
    nome: "Ruan R.",
    codigo: "400002",
  },
  {
    loja: "Barra Shop.",
    nome: "Lucas R.",
    codigo: "400003",
  },
  {
    loja: "Barra Shop.",
    nome: "Paloma D.",
    codigo: "400009",
  },
  {
    loja: "Barra Shop.",
    nome: "Stephany O.",
    codigo: "400010",
  },
  {
    loja: "Barra Shop.",
    nome: "João G.",
    codigo: "400012",
  },
  {
    loja: "Barra Shop.",
    nome: "Alessandro S.",
    codigo: "400013",
  },
  {
    loja: "Barra Shop.",
    nome: "Leonardo L.",
    codigo: "400014",
  },
  {
    loja: "Centro",
    nome: "Danubia M.",
    codigo: "150003",
  },
  {
    loja: "Centro",
    nome: "Maxwell O.",
    codigo: "150005",
  },
  {
    loja: "Centro",
    nome: "Rafael M.",
    codigo: "150006",
  },
  {
    loja: "Copacabana",
    nome: "Caio R.",
    codigo: "301003",
  },
  {
    loja: "Copacabana",
    nome: "Helber S.",
    codigo: "301004",
  },
  {
    loja: "Copacabana",
    nome: "Gabriel G.",
    codigo: "301005",
  },
  {
    loja: "Copacabana",
    nome: "Rayssa V.",
    codigo: "301006",
  },
  {
    loja: "Downtown",
    nome: "Alef B.",
    codigo: "500003",
  },
  {
    loja: "Downtown",
    nome: "Raphael C.",
    codigo: "500004",
  },
  {
    loja: "Downtown",
    nome: "Gabi Pita",
    codigo: "500007",
  },
  {
    loja: "Downtown",
    nome: "João P.",
    codigo: "500009",
  },
  {
    loja: "Downtown",
    nome: "Moises P.",
    codigo: "500010",
  },
  {
    loja: "Icarai",
    nome: "Vitor C.",
    codigo: "600001",
  },
  {
    loja: "Icarai",
    nome: "Vinicius L.",
    codigo: "600002",
  },
  {
    loja: "Icarai",
    nome: "Adriana B.",
    codigo: "600003",
  },
  {
    loja: "Icarai",
    nome: "RAFAELA LOURENCO IC",
    codigo: "600008",
  },
  {
    loja: "Icarai",
    nome: "Caio F.",
    codigo: "600010",
  },
  {
    loja: "Ipanema 1",
    nome: "Gabriel F.",
    codigo: "700012",
  },
  {
    loja: "Ipanema 1",
    nome: "John L.",
    codigo: "700002",
  },
  {
    loja: "Ipanema 1",
    nome: "Vitor A.",
    codigo: "700003",
  },
  {
    loja: "Nova A.",
    nome: "Caique C.",
    codigo: "700004",
  },
  {
    loja: "Ipanema 1",
    nome: "Alexandre C.",
    codigo: "700005",
  },
  {
    loja: "Leblon",
    nome: "Pedro L.",
    codigo: "190011",
  },
  {
    loja: "Leblon",
    nome: "Felipe B.",
    codigo: "19010",
  },
  {
    loja: "Leblon",
    nome: "Lucas O.",
    codigo: "190001",
  },
  {
    loja: "Leblon",
    nome: "Filipe J.",
    codigo: "190002",
  },
  {
    loja: "Leblon",
    nome: "Gabriel M.",
    codigo: "190003",
  },
  {
    loja: "Metropolitano",
    nome: "Brandon O.",
    codigo: "180003",
  },
  {
    loja: "Metropolitano",
    nome: "Ehmerson F.",
    codigo: "180009",
  },
  {
    loja: "Metropolitano",
    nome: "Raphael F.",
    codigo: "180010",
  },
  {
    loja: "Metropolitano",
    nome: "Erico S.",
    codigo: "180013",
  },
  {
    loja: "Nova A.",
    nome: "Rodrigo Q.",
    codigo: "130003",
  },
  {
    loja: "Nova A.",
    nome: "Thaina M.",
    codigo: "130006",
  },
  {
    loja: "Nova A.",
    nome: "Lucas M.",
    codigo: "130008",
  },
  {
    loja: "Nova A.",
    nome: "Caique C.",
    codigo: "700004",
  },
  {
    loja: "Plaza",
    nome: "Jean E.",
    codigo: "300001",
  },
  {
    loja: "Plaza",
    nome: "Victor V.",
    codigo: "300008",
  },
  {
    loja: "Plaza",
    nome: "Yasmin P.",
    codigo: "300010",
  },
  {
    loja: "Rio Design",
    nome: "Dennis F.",
    codigo: "100005",
  },
  {
    loja: "Rio Design",
    nome: "Luis C.",
    codigo: "100007",
  },
  {
    loja: "Rio Design",
    nome: "Claudio M.",
    codigo: "100008",
  },
  {
    loja: "Rio Design",
    nome: "Pedro N.",
    codigo: "100009",
  },
  {
    loja: "Rio Sul",
    nome: "Antônio V.",
    codigo: "140002",
  },
  {
    loja: "Rio Sul",
    nome: "Daniel S.",
    codigo: "140012",
  },
  {
    loja: "Tijuca",
    nome: "Beatriz M.",
    codigo: "160008",
  },
  {
    loja: "Comercial",
    nome: "Alexandre T.",
    codigo: "160009",
  },
  {
    loja: "Tijuca",
    nome: "Felippe S.",
    codigo: "160011",
  },
  {
    loja: "Tijuca",
    nome: "Michael J.",
    codigo: "160013",
  },
  {
    codigo: "120002",
    nome: "Bia",
    loja: "E-com",
  },
  {
    codigo: "120003",
    nome: "Daniel B.",
    loja: "Designer",
  },
  {
    codigo: "120004",
    nome: "Luis A.",
    loja: "Estilo",
  },
  {
    codigo: "120005",
    nome: "Isabela P.",
    loja: "Estilo",
  },
  {
    codigo: "120006",
    nome: "Thadeu M.",
    loja: "Designer",
  },
  {
    codigo: "120007",
    nome: "Noemy S.",
    loja: "Produção",
  },
  {
    codigo: "120008",
    nome: "Beatriz C.",
    loja: "Marketing",
  },
  {
    codigo: "120009",
    nome: "Guilherme S.",
    loja: "Designer",
  },
  {
    codigo: "120010",
    nome: "Ana C.",
    loja: "E-commerce",
  },
  {
    codigo: "120011",
    nome: "Ilana F.",
    loja: "Ecom",
  },
  {
    codigo: "120012",
    nome: "Raphael C.",
    loja: "Ecom",
  },
  {
    codigo: "120014",
    nome: "Rogeria P.",
    loja: "Ecom",
  },
  {
    codigo: "120015",
    nome: "Clésio M.",
    loja: "Ecom",
  },
  {
    codigo: "120016",
    nome: "Johnny M.",
    loja: "Ecom",
  },
  {
    codigo: "120017",
    nome: "Guilherme A.",
    loja: "Ecom",
  },
  {
    codigo: "400008",
    nome: "Sergio Valpaços",
    loja: "Barra shopping",
  },
  {
    codigo: "300009",
    nome: "Rafael A.",
    loja: "Plaza",
  },
  {
    codigo: "300014",
    nome: "Sergio C.",
    loja: "Plaza",
  },
  {
    codigo: "400007",
    nome: "Gabriel F.",
    loja: "Barra Shop.",
  },
  {
    codigo: "400008",
    nome: "Sergio V.",
    loja: "Barra Shop.",
  },
  {
    codigo: "600005",
    nome: "Rodrigo L.",
    loja: "Icarai",
  },
  {
    codigo: "600009",
    nome: "Gabriel R.",
    loja: "Icarai",
  },
  {
    codigo: "600011",
    nome: "André L.",
    loja: "Icarai",
  },
  {
    codigo: "700011",
    nome: "Yasmin L.",
    loja: "Ipanema 1",
  },
  {
    codigo: "100002",
    nome: "Layla R.",
    loja: "Rio Design",
  },
  {
    codigo: "130009",
    nome: "Danilo",
    loja: "Nova A.",
  },
  {
    codigo: "130010",
    nome: "Christiyann",
    loja: "Nova A.",
  },
  {
    codigo: "140006",
    nome: "Luis Filipe",
    loja: "Rio Sul",
  },
  {
    codigo: "140015",
    nome: "Arthur A.",
    loja: "Rio Sul",
  },
  {
    codigo: "140018",
    nome: "Gabriel B.",
    loja: "Rio Sul",
  },
  {
    codigo: "140019",
    nome: "Flavio V.",
    loja: "Rio Sul",
  },
  {
    codigo: "140020",
    nome: "Samara S.",
    loja: "Rio Sul",
  },
  {
    codigo: "160012",
    nome: "Gabriel S.",
    loja: "Tijuca",
  },
  {
    codigo: "160014",
    nome: "Danielle M.",
    loja: "Tijuca",
  },
  {
    codigo: "160015",
    nome: "Leonam R.",
    loja: "Tijuca",
  },
  {
    codigo: "180006",
    nome: "Gabriel C.",
    loja: "Metropolitano",
  },
  {
    codigo: "180011",
    nome: "Leonardo L.",
    loja: "Metropolitano",
  },
  {
    codigo: "190009",
    nome: "Guilherme G.",
    loja: "Leblon",
  },
  {
    codigo: "301001",
    nome: "Fabiano G.",
    loja: "Copacabana",
  },
  {
    codigo: "301002",
    nome: "Fernanda S.",
    loja: "Copacabana",
  },
  {
    codigo: "500008",
    nome: "Mauricio T.",
    loja: "Rio Design",
  },
  {
    codigo: "190007",
    nome: "Thaylon",
    loja: "Ecom",
  },
  {
    codigo: "160016",
    nome: "Carlos Nielson",
    loja: "Tijuca",
  },
];

$("#shipping-calculate-link").on("click", async function () {
  console.log("clicou");

  await setTimeout(appendSellerCode, 2000);
  await setTimeout(u, 2000);
});

const showVendedorField = async function () {
  isFieldHidden = false;

  let orderFormId = "";

  await vtexjs.checkout.getOrderForm().then((orderForm) => {
    orderFormId = orderForm.orderFormId;
    console.log(orderForm);
    console.log(orderFormId);
  });

  await fetch(
    `https://www.armadillo.com.br/api/checkout/pub/orderForm/${orderFormId}/attachments/marketingData`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expectedOrderFormSections: [
          "items",
          "gifts",
          "totalizers",
          "clientProfileData",
          "shippingData",
          "paymentData",
          "sellers",
          "messages",
          "marketingData",
          "clientPreferencesData",
          "storePreferencesData",
          "customData",
        ],
        utmCampaign: null,
        utmiCampaign: null,
      }),
    }
  )
    .then((response) => {
      console.log(response);
      isFieldHidden = true;
    })
    .catch((err) => {
      console.error(err);
    });

  isFieldHidden = false;
  await appendSellerCode();
};

const getActualSeller = function (code) {
  const actualSeller = sellerJSON.find((obj) => obj.codigo === code);
  if (actualSeller) return `${actualSeller.nome} - ${actualSeller.loja}`;
  else return "";
};

const setSellerCode = async function (code) {
  const numericCode = parseInt(code);
  if (isNaN(numericCode)) {
    alert("Código inválido - deve conter apenas números");
    return;
  }
  const foundSeller = sellerJSON.find((obj) => obj.codigo === code);

  if (foundSeller) {
    let SellerCode = "";
    let SellerName = "";
    let orderFormId = "";

    await vtexjs.checkout.getOrderForm().then((orderForm) => {
      orderFormId = orderForm.orderFormId;
      console.log(orderForm);
      console.log(orderFormId);
    });

    await fetch(
      `https://www.armadillo.com.br/api/dataentities/SC/search?Code=${code}&_fields=Code,Name`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.vtex.ds.v10+json",
          "REST-Range": "resources=0-10",
        },
      }
    )
      .then(function (serverPromise) {
        serverPromise
          .json()
          .then(function (response) {
            console.log(response);
            if (response && response.length > 0) {
              SellerName = response[0].Name;
              SellerCode = response[0].Code;
              console.log(response[0]);
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      })
      .catch(function (e) {
        console.log(e);
      });

    await fetch(
      `https://www.armadillo.com.br/api/checkout/pub/orderForm/${orderFormId}/attachments/marketingData`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expectedOrderFormSections: [
            "items",
            "gifts",
            "totalizers",
            "clientProfileData",
            "shippingData",
            "paymentData",
            "sellers",
            "messages",
            "marketingData",
            "clientPreferencesData",
            "storePreferencesData",
            "customData",
          ],
          utmCampaign: code,
          utmiCampaign: code,
        }),
      }
    )
      .then((response) => {
        console.log(response);
        isFieldHidden = true;
      })
      .catch((err) => {
        console.error(err);
      });

    document.location.reload();
  } else {
    alert("Código inválido");
  }
  //appendSellerCode();
};

const removeSellerCode = async function () {
  let orderFormId = "";

  await vtexjs.checkout.getOrderForm().then((orderForm) => {
    orderFormId = orderForm.orderFormId;
  });

  console.log("remove");

  await fetch(
    `https://www.armadillo.com.br/api/checkout/pub/orderForm/${orderFormId}/attachments/marketingData`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expectedOrderFormSections: [
          "items",
          "gifts",
          "totalizers",
          "clientProfileData",
          "shippingData",
          "paymentData",
          "sellers",
          "messages",
          "marketingData",
          "clientPreferencesData",
          "storePreferencesData",
          "customData",
        ],
        utmCampaign: null,
        utmiCampaign: null,
      }),
    }
  )
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.error(err);
    });

  appendSellerCode();
};

async function setButtonDisabled() {
  var buttonList = document.querySelectorAll("[id=payment-data-submit]");
  buttonList[1].setAttribute("disabled", "disabled");
}

async function reCAPTCHA() {
  var submitButton = document.getElementById("payment-data-submit");

  var newItem = document.createElement("DIV");
  newItem.innerHTML =
    '<div class="g-recaptcha" data-callback="recaptchaCallback" data-sitekey="6LdpdXAaAAAAANAowuzQXOXa5YKw8OSp-3atohZJ" id="captcha_container" style="margin-top: 15px;"></div>';
  var parentDiv = submitButton.parentNode;
  parentDiv.insertBefore(newItem, submitButton);

  var intervalId = window.setInterval(function () {
    setButtonDisabled();
  }, 1000);

  grecaptcha.render("captcha_container", {
    sitekey: "6LdpdXAaAAAAANAowuzQXOXa5YKw8OSp-3atohZJ",
    callback: function (response) {
      var buttonList = document.querySelectorAll("[id=payment-data-submit]");
      buttonList[1].removeAttribute("disabled");
      clearInterval(intervalId);
      console.log(response);
    },
  });
}
window._omnichatConfig = {
  retailerId: "KMhx3KewQsEV",
  accountName: "armadillo",
};
window.addEventListener("load", () => {
  const script = document.createElement("script");
  script.src = "https://vtex-scripts.omni.chat/abandoned-carts.min.js";
  script.async = true;
  document.head.appendChild(script);
});
