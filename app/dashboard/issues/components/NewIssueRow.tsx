'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Issue, type IssueType, type IssueStatus, type Assignee, STATUSES, ASSIGNEES } from "../types/issue"
import { FileIcon, ImageIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import PhotosModal from "./PhotosModal"

interface NewIssueRowProps {
  onSave: (newIssue: Omit<Issue, "id" | "dateOpened" | "dateUpdated">) => void
  onDiscard: () => void
}

export default function NewIssueRow({ onSave, onDiscard }: NewIssueRowProps) {
  const [newIssue, setNewIssue] = useState<Omit<Issue, "id" | "dateOpened" | "dateUpdated">>({
    type: "Functionality",
    name: "",
    description: "",
    filePaths: [],
    elementCommandName: "",
    status: "Not Started",
    photos: [],
    comments: [],
    assignee: "Shlomi",
  })
  const [isExpanded, setIsExpanded] = useState(true)
  const [newFilePath, setNewFilePath] = useState("")
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false)

  const handleChange = (field: keyof Issue, value: string | string[]) => {
    setNewIssue((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(newIssue)
  }

  const handleAddFilePath = () => {
    if (newFilePath.trim()) {
      setNewIssue((prev) => ({
        ...prev,
        filePaths: [...prev.filePaths, newFilePath.trim()],
      }))
      setNewFilePath("")
    }
  }

  const handleUpdateFilePath = (index: number, value: string) => {
    const updatedFilePaths = [...newIssue.filePaths]
    updatedFilePaths[index] = value
    setNewIssue((prev) => ({
      ...prev,
      filePaths: updatedFilePaths,
    }))
  }

  const handleDeleteFilePath = (index: number) => {
    setNewIssue((prev) => ({
      ...prev,
      filePaths: prev.filePaths.filter((_, i) => i !== index),
    }))
  }

  const handleUpdatePhotos = (updatedPhotos: string[]) => {
    setNewIssue((prev) => ({
      ...prev,
      photos: updatedPhotos,
    }))
  }

  const getStatusColor = (status: IssueStatus) => {
    return STATUSES.find((s) => s.label === status)?.color || ""
  }

  const getAssigneeColor = (assignee: Assignee) => {
    return ASSIGNEES.find((a) => a.name === assignee)?.color || ""
  }

  const FilePathManager = () => (
    <div className="space-y-2">
      {newIssue.filePaths.map((path, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input value={path} onChange={(e) => handleUpdateFilePath(index, e.target.value)} className="flex-grow" />
          <Button onClick={() => handleDeleteFilePath(index)} variant="ghost" size="sm">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Input
          value={newFilePath}
          onChange={(e) => setNewFilePath(e.target.value)}
          placeholder="Add new file path"
          className="flex-grow"
          autoFocus
        />
        <Button onClick={handleAddFilePath} variant="outline" size="sm">
          Add
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/50 cursor-pointer">
        <td className="py-3 px-6 text-left whitespace-nowrap">New</td>
        <td className="py-3 px-6 text-left">
          <Select value={newIssue.type} onValueChange={(value) => handleChange("type", value as IssueType)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Functionality">Functionality</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Translations">Translations</SelectItem>
            </SelectContent>
          </Select>
        </td>
        <td className="py-3 px-6 text-left">
          <Input
            value={newIssue.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Issue name"
          />
        </td>
        <td className="py-3 px-6 text-left">
          <Select value={newIssue.status} onValueChange={(value) => handleChange("status", value as IssueStatus)}>
            <SelectTrigger className={`w-[120px] ${getStatusColor(newIssue.status)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.label} value={status.label} className={status.color}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="py-3 px-6 text-left">
          <Select value={newIssue.assignee} onValueChange={(value) => handleChange("assignee", value as Assignee)}>
            <SelectTrigger className={`w-[120px] ${getAssigneeColor(newIssue.assignee)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNEES.map((assignee) => (
                <SelectItem key={assignee.name} value={assignee.name} className={assignee.color}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="py-3 px-6 text-left">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <FileIcon className="h-4 w-4 mr-2" />
                {newIssue.filePaths.length}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <FilePathManager />
            </PopoverContent>
          </Popover>
        </td>
        <td className="py-3 px-6 text-left">
          <Button variant="outline" size="sm" disabled>
            0
          </Button>
        </td>
        <td className="py-3 px-6 text-left">
          <Button variant="outline" size="sm" disabled>
            <ImageIcon className="h-4 w-4 mr-2" />0
          </Button>
        </td>
        <td className="py-3 px-6 text-left">-</td>
        <td className="py-3 px-6 text-left">-</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={11} className="bg-muted/50 p-4">
            <div className="flex">
              <div className="w-3/5 pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Select value={newIssue.type} onValueChange={(value) => handleChange("type", value as IssueType)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Functionality">Functionality</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Translations">Translations</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={newIssue.status}
                        onValueChange={(value) => handleChange("status", value as IssueStatus)}
                      >
                        <SelectTrigger className={`w-[120px] ${getStatusColor(newIssue.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status.label} value={status.label} className={status.color}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={newIssue.assignee}
                        onValueChange={(value) => handleChange("assignee", value as Assignee)}
                      >
                        <SelectTrigger className={`w-[120px] ${getAssigneeColor(newIssue.assignee)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSIGNEES.map((assignee) => (
                            <SelectItem key={assignee.name} value={assignee.name} className={assignee.color}>
                              {assignee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="issueName"
                        value={newIssue.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Issue name"
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description:</h4>
                    <Textarea
                      value={newIssue.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Issue description"
                      className="w-full"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <div className="w-2/5 pl-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">File Paths:</h4>
                    <FilePathManager />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Photos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {newIssue.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`New issue photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded cursor-pointer"
                        />
                      ))}
                      <div
                        className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer"
                        onClick={() => setIsPhotosModalOpen(true)}
                      >
                        <PlusIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={onDiscard}>
                Discard
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </td>
        </tr>
      )}
      <PhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        photos={newIssue.photos}
        onUpdatePhotos={handleUpdatePhotos}
      />
    </>
  )
}

