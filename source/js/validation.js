"use strict";
(function () {
  const USERNAME_VALIDATE = /[^-а-яё ]+/i;
  const PHONE_VALIDATE = /^\+\d\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

  let deliveryForm = document.querySelector(".delivery__form");
  let contactName = document.getElementById("contact-name");
  let contactNameWrapper = contactName.parentElement;
  let phoneNumber = document.getElementById("phone-number");
  let phoneNumberWrapper = phoneNumber.parentElement;
  let shipToAddress = document.getElementById("ship-to-address");
  let shipToAddressWrapper = shipToAddress.parentElement;

  let phoneMaskOptions = {
    mask: "+{7}(000)000-00-00"
  };
  let phoneMask = IMask(phoneNumber, phoneMaskOptions);

  let createAlert = (alertContent, wrapper) => {
    if (wrapper.querySelector(".delivery__alert") === null) {
      let paragraph = document.createElement("p");

      paragraph.classList.add("delivery__alert");
      paragraph.textContent = alertContent;

      wrapper.appendChild(paragraph);
    }
  };

  let removeAlert = (wrapper) => {
    if (wrapper.querySelector(".delivery__alert") !== null) {
      wrapper.querySelector(".delivery__alert").remove();
    }
  }

  contactName.addEventListener("input", (evt) => {
    if (USERNAME_VALIDATE.test(evt.target.value)) {
      createAlert("Используйте только кириллицу, пробел и тире", contactNameWrapper);
    } else {
      removeAlert(contactNameWrapper);
    }
  });

  phoneNumber.addEventListener("change", () => {
    if (!PHONE_VALIDATE.test(phoneMask.value)) {
      createAlert("Введите корректный номер телефона", phoneNumberWrapper);
    } else {
      removeAlert(phoneNumberWrapper);
    }
  });

  phoneNumber.addEventListener("input", () => {
    if (PHONE_VALIDATE.test(phoneMask.value)) {
      removeAlert(phoneNumberWrapper);
    }
  });

  deliveryForm.addEventListener("submit", (evt) => {
    let alerts = deliveryForm.querySelectorAll(".delivery__alert");

    if (Array.from(alerts).length > 0) {
      evt.preventDefault();
    }
  })
})();
