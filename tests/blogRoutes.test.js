const request = require("supertest");
const app = require("../app");

describe("Blog Routes", () => {
    beforeAll(async () => {
        // Perform any necessary setup or operations before the tests start
    });

    afterAll(async () => {
        // Perform any necessary cleanup or operations after the tests finish
    });

    it("should create a new blog", async () => {
        const res = await request(app).post("/blogs/create").send({
            title: "Test Blog",
            description: "This is a test blog",
            tag: "Test",
            author: "John Doe",
            state: "published",
            read_count: 0,
            reading_time: 5,
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        });
        expect(res.statusCode).toBe(302);
        expect(res.header["location"]).toBe("/login");
    });

    //     it("should update an existing blog", async () => {
    //         const blogId = "MSC47hYbF";
    //     const res = await request(app)
    //       .put(`/blogs/${blogId}`) // Replace :id with the ID of the blog to update
    //       .send({
    //         title: "Updated Test Blog",
    //         description: "This is an updated test blog",
    //         tag: "Test",
    //         author: "John Doe",
    //         state: "published",
    //         read_count: 0,
    //         reading_time: 7,
    //         body: "Updated content goes here.",
    //       });
    //     expect(res.statusCode).toBe(302);
    //     expect(res.header["location"]).toBe("/create");

    //     // Add any necessary assertions here for the updated blog
    //   });

    //     it("should delete an existing blog", async () => {
    //         const blogId = "MSC47hYbF";

    //         const res = await request(app).delete(`/blogs/${blogId}`); // Replace :id with the ID of the blog to delete
    //     expect(res.statusCode).toBe(302);

    //     expect(res.statusCode).toBe("/dashboard");
    //     // Add any necessary assertions here for the deleted blog
    //   });

    //   // Add more tests for other blog routes as needed
     });
