'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Assignee, ASSIGNEES } from "../types/issue"
import { CheckIcon, XIcon } from "lucide-react"

interface UserSelectionProps {
  onUserChange: (user: Assignee) => void
}

export default function UserSelection({ onUserChange }: UserSelectionProps) {
  const [selectedUser, setSelectedUser] = useState<Assignee>("Ben")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleUserChange = (user: Assignee) => {
    setSelectedUser(user)
    setShowConfirmation(true)
  }

  const confirmChange = () => {
    onUserChange(selectedUser)
    setShowConfirmation(false)
  }

  const cancelChange = () => {
    setSelectedUser("Ben")
    setShowConfirmation(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedUser} onValueChange={handleUserChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          {ASSIGNEES.map((assignee) => (
            <SelectItem key={assignee.name} value={assignee.name}>
              {assignee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showConfirmation && (
        <>
          <Button size="sm" onClick={confirmChange}>
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={cancelChange}>
            <XIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

