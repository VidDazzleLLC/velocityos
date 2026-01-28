'use client'

import { useState, useRef, useEffect } from 'react'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

interface CommandHistory {
  command: string
  output: string[]
  timestamp: Date
}

export default function TerminalPage() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: '',
      output: [
        'VelocityOS Terminal v1.0.0',
        'Type "help" for available commands.',
        '',
      ],
      timestamp: new Date(),
    },
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) {
      setHistory([...history, { command: '', output: [], timestamp: new Date() }])
      return
    }

    // Add to command history
    setCommandHistory([...commandHistory, trimmedCmd])
    setHistoryIndex(-1)

    const parts = trimmedCmd.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    let output: string[] = []

    switch (command) {
      case 'help':
        output = [
          'Available commands:',
          '',
          '  help              - Show this help message',
          '  clear             - Clear the terminal',
          '  version           - Show VelocityOS version',
          '  status            - Show system status',
          '  date              - Show current date and time',
          '  echo <text>       - Echo text back',
          '  whoami            - Show current user',
          '  stats             - Show business statistics',
          '  ai                - Get AI insights',
          '',
        ]
        break

      case 'clear':
        setHistory([
          {
            command: '',
            output: ['Terminal cleared.', ''],
            timestamp: new Date(),
          },
        ])
        return

      case 'version':
        output = [
          'VelocityOS Terminal v1.0.0',
          'AI-Powered Business Operating System',
          'Build: 2026.01.28',
          '',
        ]
        break

      case 'status':
        output = [
          'System Status: ✅ Operational',
          'AI Engine: ✅ Online',
          'Database: ✅ Connected',
          'API: ✅ Responding',
          'Uptime: 47 days, 3 hours',
          '',
        ]
        break

      case 'date':
        output = [new Date().toString(), '']
        break

      case 'echo':
        output = [args.join(' '), '']
        break

      case 'whoami':
        output = ['Current user: admin@velocityos.com', 'Role: Administrator', '']
        break

      case 'stats':
        output = [
          'Business Statistics:',
          '',
          '  Total Revenue:     $45,231',
          '  Active Users:      2,345',
          '  Conversion Rate:   3.2%',
          '  Tasks Completed:   89',
          '  AI Automations:    156',
          '',
        ]
        break

      case 'ai':
        output = [
          '🤖 AI Insight:',
          '',
          'Your conversion rate is up 15% this week.',
          'Recommendation: Consider scaling your marketing budget',
          'on high-performing campaigns.',
          '',
        ]
        break

      default:
        output = [
          `Command not found: ${command}`,
          'Type "help" for available commands.',
          '',
        ]
    }

    setHistory([
      ...history,
      {
        command: trimmedCmd,
        output,
        timestamp: new Date(),
      },
    ])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    }
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <AuthenticatedLayout>
      <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-12rem)] flex flex-col">
        <div className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-semibold">⌨️ VelocityOS Terminal</h2>
          <p className="text-sm text-white/80 mt-1">
            Command-line interface for power users
          </p>
        </div>

        <div
          className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-6 overflow-y-auto cursor-text rounded-b-xl"
          onClick={focusInput}
        >
          {history.map((entry, index) => (
            <div key={index} className="mb-4">
              {entry.command && (
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">$</span>
                  <span className="text-white">{entry.command}</span>
                </div>
              )}
              {entry.output.map((line, lineIndex) => (
                <div key={lineIndex} className="ml-4">
                  {line}
                </div>
              ))}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-blue-400">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-white"
              autoFocus
              spellCheck={false}
            />
          </form>

          <div ref={terminalEndRef} />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
