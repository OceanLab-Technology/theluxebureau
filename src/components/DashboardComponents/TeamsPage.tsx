"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Mail, Phone, Users, Shield, User } from "lucide-react"

// Dummy team data
const teamMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@luxebureau.com",
    role: "Admin",
    department: "Management",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@luxebureau.com",
    role: "Manager",
    department: "Sales",
    status: "Active",
    joinDate: "2023-03-20",
    avatar: "",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james.wilson@luxebureau.com",
    role: "Staff",
    department: "Customer Service",
    status: "Active",
    joinDate: "2023-06-10",
    avatar: "",
  },
  {
    id: "4",
    name: "Sophie Chen",
    email: "sophie.chen@luxebureau.com",
    role: "Staff",
    department: "Inventory",
    status: "Active",
    joinDate: "2023-08-05",
    avatar: "",
  },
  {
    id: "5",
    name: "Robert Davis",
    email: "robert.davis@luxebureau.com",
    role: "Manager",
    department: "Marketing",
    status: "Inactive",
    joinDate: "2023-02-28",
    avatar: "",
  },
]

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "manager":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "staff":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

const getStatusColor = (status: string) => {
  return status === "Active" 
    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getRoleIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return Shield
    case "manager":
      return Users
    default:
      return User
  }
}

export function TeamsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold font-century">Teams</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-century">Teams</h2>
            <p className="text-muted-foreground">
              Manage your team members and their permissions
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(member => member.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(member => member.role === "Admin").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(teamMembers.map(member => member.department)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => {
            const RoleIcon = getRoleIcon(member.role)
            return (
              <Card key={member.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge 
                          className={getStatusColor(member.status)}
                          variant="secondary"
                        >
                          {member.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.department}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RoleIcon className="h-4 w-4" />
                    <Badge 
                      className={getRoleColor(member.role)}
                      variant="secondary"
                    >
                      {member.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Joined {member.joinDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
