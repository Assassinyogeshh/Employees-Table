import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const userSchema = z.object({
  name: z.string().nonempty("Name is required"),
  role: z.string().nonempty("Role is required"),
  email: z.string().email("Invalid email format"),
  team: z.string().nonempty("Team is required"),
});

function AddUserForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      team: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              id="name"
              label="Name"
              placeholder="Enter name"
              {...field}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Input
              id="role"
              label="Role"
              placeholder="Enter role"
              {...field}
              error={errors.role?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              id="email"
              label="Email"
              placeholder="Enter email"
              type="email"
              {...field}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          name="team"
          control={control}
          render={({ field }) => (
            <Input
              id="team"
              label="Team"
              placeholder="Enter team"
              {...field}
              error={errors.team?.message}
            />
          )}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Add User
        </Button>
      </div>
    </form>
  );
}

export default AddUserForm;
