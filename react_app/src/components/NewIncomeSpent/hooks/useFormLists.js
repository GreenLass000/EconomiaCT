import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFormLists = () => {
    const [lists, setLists] = useState({
        personList: [],
        incomeList: [],
        spentList: []
    });

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const [incomeResponse, spentResponse, personResponse] = await Promise.all([
                    axios.get(`http://192.168.1.117:5000/incomelists`),
                    axios.get(`http://192.168.1.117:5000/spentlists`),
                    axios.get(`http://192.168.1.117:5000/persons/active`)
                ]);

                setLists({
                    incomeList: incomeResponse.data,
                    spentList: spentResponse.data,
                    personList: personResponse.data
                });
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };

        fetchLists();
    }, []);

    return lists;
};
