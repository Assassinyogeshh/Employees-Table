"use client";

import { DataTable } from "./dataTable";
import { faker } from "@faker-js/faker";
import { useState } from "react";

export default function TableComponent() {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "email",
      header: "Email Address",
    },
    {
      accessorKey: "team",
      header: "Team",
    },
  ];

  // Generate random data using faker
  const generateRandomData = (numRows) => {
    const roles = [
      "Developer",
      "Designer",
      "Product Manager",
      "QA Engineer",
      "DevOps Engineer",
    ];
    const statuses = ["Active", "Inactive", "Pending", "Suspended"];
    const teams = ["Alpha", "Beta", "Gamma", "Delta", "Omega"];

    const data = [];

    for (let i = 0; i < numRows; i++) {
      data.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        status: faker.helpers.arrayElement(statuses),
        role: faker.helpers.arrayElement(roles),
        email: faker.internet.email(),
        team: faker.helpers.arrayElement(teams),
      });
    }

    return data;
  };

  const [data] = useState(() => generateRandomData(20)); 

  return (
    <div className=" w-100 h-auto flex justify-between items-center">
   <div className="w-[100%] border border-black-1">
      <DataTable columns={columns} data={data} />
  </div>
    </div>
  );
}
