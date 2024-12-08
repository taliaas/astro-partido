export default class GraficoService {
  async getGraphValues(core: string, indicador: string, anno: number) {
    try {
      const response = await fetch(`http://localhost:5000/graph/${core}/${indicador}/${anno}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const graph = await response.json();
      return graph;
    } catch (error) {
      console.error('Error al recuperar los datos del gráfico', error);
    }
  }

}
