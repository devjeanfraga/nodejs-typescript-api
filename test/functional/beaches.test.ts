describe('Beaches functional test', () => {
  describe('When create a beach', () => {
    it('Should create a beach with success', async ()=> {
      const newBeach= {
        name: 'Manly',
        position: 'E',
        lat: -33.792726,
        lng: 151.289824,
      }

      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
      // Para o expect.objectContaining() basta que tenha essas chaves do newBeache dentro do objeto, mesmo tendo outras chaves dentro
      // do objeto como o Id que é dinamico; 
      

    })
  });
});