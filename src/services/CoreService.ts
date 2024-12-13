export default class CoreService {
  async createCore(coreData: { name: string }, areaData: any[]) {
    console.log(JSON.stringify({ coreData, areaData }))
    try {
      const response = await fetch(`http://localhost:3000/core`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coreData, areaData: [areaData] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
}
