
import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-NDXQ7J1B4Y";

export const initGA = () => {
    ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.hash || window.location.pathname });
};

export const logEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({
        category,
        action,
        label
    });
};
