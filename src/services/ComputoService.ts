export default class ComputoService {
    async getAllComputo() {
      try {
        const response = await fetch(`http://localhost:5000/computo`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const comp = await response.json();
        return comp;
      } catch (error) {
        console.error('Error al recuperar los datos del computo', error);
      }
    }
  
  }
  