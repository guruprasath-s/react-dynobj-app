export const userSchema = {
  type: "object",
  properties: {
    users: {
      type: "array",
      minItems: 0,
      maxItems: 20,
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            faker: "random.uuid",
          },
          firstName: {
            type: "string",
            faker: "name.firstName",
            required: true,
          },
          lastName: {
            type: "string",
            faker: "name.lastName",
            required: true,
          },
          email: {
            type: "string",
            faker: "internet.email",
            required: true,
          },
          department: {
            type: "string",
            required: true,
            description: "Department",
          },
          location: {
            type: "string",
            description: "Location",
          },
          employmentType: {
            type: "string",
            description: "Employment type",
          },
          jobTitle: {
            type: "string",
            required: true,
            description: "Job Title",
          },
          age: {
            type: "integer",
            description: "Age of the employee",
            pattern: "[0-1]{1}[0-9]{0,2}",
          },
        },
        required: [
          "id",
          "firstName",
          "lastName",
          "email",
          "department",
          "jobTitle",
        ],
      },
    },
  },
};
