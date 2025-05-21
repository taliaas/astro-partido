export default class StatusService {
  async getYear(anno: number) {
    try {
      const response = await fetch(
        `http://104.225.141.171:2002/computo/calcular_estado/${anno}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}
