import React, { useState, useMemo } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod"; 
import AddUserForm from "./form"; 

export function DataTable({ columns, data }) {
  const [newData, setNewData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({
    roles: {},
    teams: {},
  });
  const [formState, setFormState] = useState({
    id: "",
    name: "",
    role: "",
    email: "",
    team: "",
  });
  const [errors, setErrors] = useState({});

  const uniqueRoles = useMemo(() => [...new Set(data.map((item) => item.role))], [data]);
  const uniqueTeams = useMemo(() => [...new Set(data.map((item) => item.team))], [data]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        [value]: !prevState[type][value],
      },
    }));
  };

  const filteredData = useMemo(() => {
    return newData.filter((row) => {
      const roleFilter =
        !Object.values(filters.roles).includes(true) || filters.roles[row.role];
      const teamFilter =
        !Object.values(filters.teams).includes(true) || filters.teams[row.team];
      return (
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        roleFilter &&
        teamFilter
      );
    });
  }, [searchQuery, newData, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (row) => {
    setSelectedRow(row.original);
    setFormState(row.original);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedRow(null);
  };

  const handleUpdateRow = () => {
    const userSchema = z.object({
      id: z.string(),
      name: z.string().nonempty("Name is required"),
      role: z.string().nonempty("Role is required"),
      email: z.string().email("Invalid email format"),
      team: z.string().nonempty("Team is required"),
    });

    try {
      userSchema.parse(formState);

      const updatedData = newData.map((row) =>
        row.id === formState.id ? formState : row
      );
      setNewData(updatedData);
      setSelectedRow(null);
      setIsEditDialogOpen(false);
      setErrors({});
    } catch (e) {
      if (e.errors) {
        const errorMessages = e.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(errorMessages);
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const updatedData = newData.filter((item) => item.id !== id);
      setNewData(updatedData);
    }
  };

  const handleAddUser = (newUser) => {
    setNewData((prevData) => [...prevData, { ...newUser, id: Date.now().toString() }]);
    setIsAddDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div className="rounded-md border">
      <div className="p-4 flex justify-between items-center">
        <span className="flex">
          <p className="text-[18px] font-[600]">Team Members</p>
          <p className="text-purple-700 bg-purple-100 border text-[14px] rounded-[13px] w-[4.3rem] flex justify-center items-center ml-2">
            {newData.length} users
          </p>
        </span>
        <div className="w-[50%] flex justify-evenly items-center">
          <span className="w-[50%] flex border rounded justify-between items-center pr-3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name..."
              className="w-[100%] p-2"
            />
            <CiSearch className="text-[22px]" />
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CiFilter className="text-[22px]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4">
              <div>
                <h3 className="text-lg font-medium">Filter by Role</h3>
                {uniqueRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={filters.roles[role] || false}
                      onCheckedChange={() => handleFilterChange("roles", role)}
                    />
                    <Label htmlFor={role}>{role}</Label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Filter by Team</h3>
                {uniqueTeams.map((team) => (
                  <div key={team} className="flex items-center space-x-2">
                    <Checkbox
                      id={team}
                      checked={filters.teams[team] || false}
                      onCheckedChange={() => handleFilterChange("teams", team)}
                    />
                    <Label htmlFor={team}>{team}</Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-500">
                <GoPlus className="text-[22px]" />
                <span className="ml-2">Add New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>
                  Fill in the details of the new team member.
                </DialogDescription>
              </DialogHeader>
              <AddUserForm onSubmit={handleAddUser} />
              <DialogFooter>
                <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Member</DialogTitle>
                <DialogDescription>
                  Update the details of the team member.
                </DialogDescription>
              </DialogHeader>
              <form>
                <div className="space-y-4">
                  <Input
                    id="name"
                    label="Name"
                    placeholder="Enter name"
                    value={formState.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />
                  <Input
                    id="role"
                    label="Role"
                    placeholder="Enter role"
                    value={formState.role}
                    onChange={handleInputChange}
                    error={errors.role}
                  />
                  <Input
                    id="email"
                    label="Email"
                    placeholder="Enter email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                  <Input
                    id="team"
                    label="Team"
                    placeholder="Enter team"
                    value={formState.team}
                    onChange={handleInputChange}
                    error={errors.team}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleUpdateRow}>
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => header.getSortByToggleProps().onClick()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "desc" ? (
                        <FaSortDown />
                      ) : header.column.getIsSorted() === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSort />
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => handleRowClick(row)}
              className="cursor-pointer hover:bg-gray-100"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleRowClick(row);
                      setIsSheetOpen(false);
                    }}
                    variant="outline"
                  >
                    <FaEdit onClick={() => setIsEditDialogOpen(true)} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDelete(row.original.id);
                    }}
                    variant="outline"
                    color="red"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      
        <SheetContent>
          <div className="space-y-4">
            <p><strong>Name:</strong> {selectedRow?.name}</p>
            <p><strong>Role:</strong> {selectedRow?.role}</p>
            <p><strong>Email:</strong> {selectedRow?.email}</p>
            <p><strong>Team:</strong> {selectedRow?.team}</p>
          </div>
          <Button onClick={handleCloseSheet} className="mt-4">Close</Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
