'use client'

import { sql } from '@codemirror/lang-sql'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { useEffect, useRef, type JSX } from 'react'

import { Button } from '@/components/ui/button'

export interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: (value: string) => void
  isPending?: boolean
}

const SqlEditor = ({ value, onChange, onExecute, isPending }: SqlEditorProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const onChangeRef = useRef(onChange)
  const onExecuteRef = useRef(onExecute)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    onExecuteRef.current = onExecute
  }, [onExecute])

  useEffect(() => {
    if (!containerRef.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          sql(),
          oneDark,
          EditorView.lineWrapping,
          keymap.of([
            {
              key: 'Ctrl-Enter',
              mac: 'Cmd-Enter',

              run: (v) => {
                onExecuteRef.current(v.state.doc.toString())
                return true
              },
            },
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString())
            }
          }),
        ],
      }),
      parent: containerRef.current,
    })

    viewRef.current = view
    return () => view.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    const current = view.state.doc.toString()
    if (current === value) return

    view.dispatch({
      changes: { from: 0, to: current.length, insert: value },
    })
  }, [value])

  const handleExecute = () => {
    const sql = viewRef.current?.state.doc.toString() ?? ''
    onExecuteRef.current(sql)
  }

  return (
    <div className="flex shrink-0 flex-col">
      <div
        ref={containerRef}
        role="textbox"
        aria-label="Editor SQL"
        aria-multiline="true"
        className="min-h-44 border-b border-border/60 bg-background text-sm text-white sm:min-h-56"
      />
      <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-3 py-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Modo seguro</p>

        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground hidden sm:block">
            <span className="font-medium text-foreground">Atalho</span> · Ctrl + Enter
          </div>

          <Button
            type="button"
            size="sm"
            disabled={isPending}
            aria-busy={isPending}
            onClick={handleExecute}
            className="h-8 rounded-none px-3 text-[11px] uppercase tracking-[0.2em]"
          >
            {isPending ? <span aria-live="polite">Executando...</span> : 'Executar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { SqlEditor }
