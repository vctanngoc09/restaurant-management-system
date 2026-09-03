import { useEffect, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import geoapifyService from "../../../services/geoapifyService";

import styles from "./NewOrderModal.module.css";

function DeliveryRouteMap({
  restaurantLocation,
  customerLocation,
  routeGeoJson,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);

  // ==================================================
  // INIT MAP
  // ==================================================

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([10.7769, 106.7009], 12);

    L.tileLayer(geoapifyService.getMapTileUrl(), {
      maxZoom: 20,
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a> | <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>',
    }).addTo(map);

    mapRef.current = map;

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => {
      window.clearTimeout(timer);

      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  // ==================================================
  // DRAW ROUTE + POINTS
  // ==================================================

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (!restaurantLocation || !customerLocation || !routeGeoJson) {
      return;
    }

    const group = L.featureGroup();

    L.geoJSON(routeGeoJson, {
      style: {
        weight: 5,
        opacity: 0.8,
      },
    }).addTo(group);

    L.circleMarker([restaurantLocation.lat, restaurantLocation.lon], {
      radius: 9,
      weight: 3,
      fillOpacity: 1,
    })
      .bindTooltip("Nhà hàng", {
        direction: "top",
      })
      .addTo(group);

    L.circleMarker([customerLocation.lat, customerLocation.lon], {
      radius: 8,
      weight: 3,
      fillOpacity: 1,
    })
      .bindTooltip("Khách hàng", {
        direction: "top",
      })
      .addTo(group);

    group.addTo(map);

    routeLayerRef.current = group;

    const bounds = group.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [28, 28],
        maxZoom: 16,
      });
    }

    window.setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [restaurantLocation, customerLocation, routeGeoJson]);

  return <div ref={containerRef} className={styles.routeMap} />;
}

export default DeliveryRouteMap;
