import server from "./index";

afterAll(() => {
  server.close();
});

test("would server listen connection when is started", () => {
  expect(server.listening).toBeTruthy();
});