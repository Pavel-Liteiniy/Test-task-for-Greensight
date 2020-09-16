"use strict";

(function () {
  const USERNAME_VALIDATE = /[^-а-яё ]+/i;
  const PHONE_VALIDATE = /^\+\d\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
  const BREAKPOINT_DESKTOP = 1200;

  let mapRendered = false;
  let addressList = document.querySelector(".pickup__wrapper--address-list");
  let zoomGap = 0.001;
  let clientWidth = document.documentElement.clientWidth;
  let tabsWrapper = document.querySelector(".tabs__inner");
  let tabs = Array.from(tabsWrapper.querySelectorAll("input"));
  let carrierTypes = Array.from(
    document.querySelector(".carrier__inner").children
  );

  let marks = [
    {
      coordinates: [55.977483, 37.163164],
      address: "Зеленоград, к1801",
      pointDescription: "Рядом с магазином Атак",
      id: "zelenograd_k1801",
      value: "zelenograd_k1801",
      name: "pickup-point",
    },
    {
      coordinates: [55.984671, 37.151673],
      address: "Зеленоград, к1446",
      pointDescription: "Напротив входа в кафе Шоколадница",
      id: "zelenograd_k1446",
      value: "zelenograd_k1446",
      name: "pickup-point",
    },
  ];

  let renderAdressList = (block, items) => {
    let fragment = document.createDocumentFragment();

    items.forEach((item) => {
      let inputItem = document.createElement("input");
      inputItem.setAttribute("type", "radio");
      inputItem.setAttribute("name", item.name);
      inputItem.setAttribute("id", item.id);
      inputItem.setAttribute("value", item.value);
      inputItem.setAttribute("data-coordinates", item.coordinates);
      inputItem.setAttribute("required", "");
      inputItem.classList.add("visually_hidden");

      fragment.appendChild(inputItem);

      let labelItem = document.createElement("label");
      labelItem.setAttribute("for", item.id);
      labelItem.textContent = item.address;

      fragment.appendChild(labelItem);
    });

    block.appendChild(fragment);
  };

  let zoomOut = (coordinates, step) => {
    coordinates[0][0] -= step;
    coordinates[0][1] -= step;
    coordinates[1][0] += step;
    coordinates[1][1] += step;
  };

  let checkClientWidth = (map) => {
    clientWidth = document.documentElement.clientWidth;
    if (clientWidth <= BREAKPOINT_DESKTOP) {
      map.behaviors.disable("drag");
    } else {
      map.behaviors.enable("drag");
    }
  };

  let init = () => {
    let map = new ymaps.Map("map", {
        center: [55.97, 37.14],
        zoom: 12,
        controls: [],
        behaviors: ["default"],
      }),
      pickUpPointsCollection = new ymaps.GeoObjectCollection(null, {
        preset: "islands#yellowIcon",
      });

    let focusOnCollectionMarks = (collection) => {
      let startCoordinates = collection.getBounds();

      zoomOut(startCoordinates, zoomGap);

      map.setBounds(startCoordinates, { checkZoomRange: true }).then(() => {
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
      });
    };

    tabsWrapper.addEventListener("change", (evt) => {
      if (!mapRendered && evt.target.value === "pickup") {
        map.container.fitToViewport();
        mapRendered = true;

        focusOnCollectionMarks(pickUpPointsCollection);
      }
    });

    pickUpPointsCollection.events.add("click", (evt) => {
      let clickedMarkCoordinates = evt
        .get("target")
        .geometry.getCoordinates()
        .join(",");

      addressListInputs.forEach((input) => {
        if (input.dataset.coordinates === clickedMarkCoordinates) {
          input.checked = true;
          return true;
        }
      });
    });

    addressList.addEventListener("change", (evt) => {
      pickUpPointsCollection.each((collectionItem) => {
        let collectionItemCoordinates = collectionItem.geometry
          .getCoordinates()
          .join(",");

        if (collectionItemCoordinates === evt.target.dataset.coordinates) {
          collectionItem.balloon.open();
        }
      });
    });

    checkClientWidth(map);

    window.addEventListener("resize", (evt) => {
      checkClientWidth(map);
    });

    marks.forEach((mark) => {
      pickUpPointsCollection.add(
        new ymaps.Placemark(
          mark.coordinates,
          {
            balloonContent: [
              `<p><b>${mark.address}</b></p>`,
              `<p>${mark.pointDescription}</p>`,
            ].join(""),
            balloonContentFooter: "Пункт Самовывоза",
          },
          {
            iconLayout: "default#image",
            iconImageHref: "./img/pin.svg",
            iconImageSize: [34, 40],
            iconImageOffset: [-17, -40],
          }
        )
      );

      map.geoObjects.add(pickUpPointsCollection);
      focusOnCollectionMarks(pickUpPointsCollection);
    });
  };

  ymaps.ready(init);
  renderAdressList(addressList, marks);

  let addressListInputs = addressList.querySelectorAll('input[type="radio"]');

  let selectTab = (tabValue) => {
    carrierTypes.forEach((carrierType) =>
      Array.from(carrierType.classList).includes(tabValue)
        ? (carrierType.style.display = "block")
        : (carrierType.style.display = "none")
    );
  };

  tabs.forEach((tab) => {
    if (tab.checked) {
      selectTab(tab.value);
    }
  });

  tabsWrapper.addEventListener("change", (evt) => {
    evt.preventDefault();

    selectTab(evt.target.value);
  });
})();
