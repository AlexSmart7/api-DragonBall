import axios from 'axios';

async function getPersonaje() {
    try{
        const response = await axios.get('https://dragonball-api.com/api/characters');
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

getPersonaje()