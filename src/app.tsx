import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('expert-notes@1.0.0')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  })
  const [searchQuery, setSearchQuery] = useState('')

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesList = [newNote, ...notes]

    setNotes(notesList)

    localStorage.setItem('expert-notes@1.0.0', JSON.stringify(notesList))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('expert-notes@1.0.0', JSON.stringify(notesArray))

    toast.success('Nota apagada com sucesso')
  }

  function handleSearchQuery(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearchQuery(query)
  }

  const filteredNotes =
    searchQuery !== ''
      ? notes.filter((note) =>
          note.content
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase()),
        )
      : notes

  return (
    <div className="mx-auto my-12 max-w-6xl space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="placeholder:text-state-500 w-full bg-transparent text-3xl font-semibold tracking-tight outline-none"
          onChange={handleSearchQuery}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          )
        })}
      </div>
    </div>
  )
}
