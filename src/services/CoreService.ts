export default class CoreService {
  async createCore(coreData: { name: string }, areaData: any[]) {
    console.log(areaData,coreData)
    try {
      const response = await fetch(`http://localhost:3000/core`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coreData, areaData),
      });
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

}
