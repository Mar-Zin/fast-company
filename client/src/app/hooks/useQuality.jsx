import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import qualityService from "../services/quality.service";
import { toast } from "react-toastify";

const QualityContext = React.createContext();

export const useQuality = () => {
    return useContext(QualityContext);
};

export const QualityProvider = ({ children }) => {
    const [qualities, setQualities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    function catchError(error) {
        const { message } = error.response.data;
        setError(message);
    }

    async function getQualities() {
        try {
            const { content } = await qualityService.fetchAll();
            setQualities(content);
            setIsLoading(false);
        } catch (error) {
            catchError(error);
        }
    }

    function getQuality(id) {
        return qualities.find((q) => q._id === id);
    }

    useEffect(() => {
        getQualities();
    }, []);

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
            setError(null);
        }
    }, [error]);

    return (
        <QualityContext.Provider value={{ isLoading, getQuality, qualities }}>
            {children}
        </QualityContext.Provider>
    );
};

QualityProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
