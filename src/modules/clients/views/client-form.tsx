'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, type JSX } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { createCliente, updateCliente } from '@/actions/client'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useCep } from '@/hooks/use-cep'
import { clienteSchema, defaultValuesPF, defaultValuesPJ } from '@/schemas/client.schema'
import type { ClienteFormData, ClienteFormInputData } from '@/types/user.type'
import { ESTADOS_BR, formatCEP, formatCNPJ, formatCPF, formatTelefone } from '@/utils/formater'

import { FormSection } from '../components/form-section'
import { MaskedInputField } from '../components/masked-input-field'

interface ClienteFormProps {
  mode: 'create' | 'edit'
  clienteId?: string
  defaultValues?: ClienteFormData
}

const ClienteForm = ({ mode, clienteId, defaultValues }: ClienteFormProps): JSX.Element => {
  const router = useRouter()
  const { fetchCep, loading: cepLoading } = useCep()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { isSubmitting },
  } = useForm<ClienteFormInputData, unknown, ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: defaultValues ?? defaultValuesPF,
  })

  const tipo = useWatch({ control, name: 'tipo' }) as 'PESSOA_FISICA' | 'PESSOA_JURIDICA'

  const handleTipoChange = useCallback(
    (value: 'PESSOA_FISICA' | 'PESSOA_JURIDICA') => {
      reset(value === 'PESSOA_FISICA' ? defaultValuesPF : defaultValuesPJ)
    },
    [reset]
  )

  const handleCepBlur = useCallback(
    async (cep: string) => {
      const data = await fetchCep(cep)
      if (!data) return
      setValue('rua', data.rua, { shouldValidate: true })
      setValue('bairro', data.bairro, { shouldValidate: true })
      setValue('cidade', data.cidade, { shouldValidate: true })
      setValue('estado', data.estado, { shouldValidate: true })
    },
    [fetchCep, setValue]
  )

  const onSubmit = useCallback(
    async (values: ClienteFormData) => {
      try {
        if (mode === 'edit' && !clienteId) {
          toast.error('ID do cliente não encontrado.')
          return
        }

        const result =
          mode === 'create' ? await createCliente(values) : await updateCliente(clienteId!, values)

        if (result.success) {
          toast.success(result.message)
          router.refresh()
          router.push('/clients')
        } else {
          toast.error(result.error)
          if ('fieldErrors' in result && result.fieldErrors) {
            for (const [field, msgs] of Object.entries(result.fieldErrors)) {
              setError(field as keyof ClienteFormData, { message: msgs[0] })
            }
          }
        }
      } catch {
        toast.error('Erro inesperado. Tente novamente.')
      }
    },
    [mode, clienteId, router, setError]
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* ── Tipo de Cadastro ──────────────────────────────────────────────── */}
      <FormSection title="Tipo de Cadastro">
        <Tabs value={tipo} onValueChange={(v) => handleTipoChange(v as typeof tipo)}>
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="PESSOA_FISICA" disabled={mode === 'edit'}>
              Pessoa Física
            </TabsTrigger>
            <TabsTrigger value="PESSOA_JURIDICA" disabled={mode === 'edit'}>
              Pessoa Jurídica
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === 'edit' && (
          <p className="mt-2 text-xs text-muted-foreground">
            O tipo de pessoa não pode ser alterado após o cadastro.
          </p>
        )}
      </FormSection>

      {/* ── Dados de Identificação ────────────────────────────────────────── */}
      <FormSection title={tipo === 'PESSOA_FISICA' ? 'Dados Pessoais' : 'Dados da Empresa'}>
        <div className="grid gap-4 sm:grid-cols-2">
          {tipo === 'PESSOA_FISICA' ? (
            <>
              <Controller
                name="nomeCompleto"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nome Completo *</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="name"
                      placeholder="João da Silva"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.error ? 'nomeCompleto-error' : undefined}
                    />
                    <FieldError id="nomeCompleto-error">{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="cpf"
                control={control}
                render={({ field, fieldState }) => (
                  <MaskedInputField
                    field={field}
                    fieldState={fieldState}
                    label="CPF *"
                    errorId="cpf-error"
                    placeholder="000.000.000-00"
                    mask={formatCPF}
                    inputMode="numeric"
                  />
                )}
              />

              <Controller
                name="rg"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>RG</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="00.000.000-0"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.error ? 'rg-error' : undefined}
                    />
                    <FieldError id="rg-error">{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="dataNascimento"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Data de Nascimento</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.error ? 'dataNascimento-error' : undefined}
                    />
                    <FieldError id="dataNascimento-error">{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </>
          ) : (
            <>
              <Controller
                name="razaoSocial"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Razão Social *</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Empresa LTDA"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.error ? 'razaoSocial-error' : undefined}
                    />
                    <FieldError id="razaoSocial-error">{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="nomeFantasia"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nome Fantasia</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Nome Fantasia"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.error ? 'nomeFantasia-error' : undefined}
                    />
                    <FieldError id="nomeFantasia-error">{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="cnpj"
                control={control}
                render={({ field, fieldState }) => (
                  <MaskedInputField
                    field={field}
                    fieldState={fieldState}
                    label="CNPJ *"
                    errorId="cnpj-error"
                    placeholder="00.000.000/0000-00"
                    mask={formatCNPJ}
                    inputMode="numeric"
                  />
                )}
              />

              <Controller
                name="responsavelNome"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Responsável</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Nome do responsável"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.error ? 'responsavelNome-error' : undefined}
                    />
                    <FieldError id="responsavelNome-error">{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="responsavelCargo"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Cargo</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Diretor, Sócio..."
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.error ? 'responsavelCargo-error' : undefined}
                    />
                    <FieldError id="responsavelCargo-error">{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </>
          )}
        </div>
      </FormSection>

      {/* ── Endereço ──────────────────────────────────────────────────────── */}
      <FormSection title="Endereço">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Controller
            name="cep"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>CEP *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="00000-000"
                  inputMode="numeric"
                  value={formatCEP(field.value ?? '')}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={(e) => {
                    field.onBlur()
                    void handleCepBlur(e.target.value)
                  }}
                  disabled={cepLoading}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'cep-error' : undefined}
                  aria-busy={cepLoading}
                />
                <FieldError id="cep-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="rua"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Rua *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Rua das Flores"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'rua-error' : undefined}
                />
                <FieldError id="rua-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="numero"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Número *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="123"
                  inputMode="numeric"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'numero-error' : undefined}
                />
                <FieldError id="numero-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="complemento"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Complemento</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Apto 12, Bloco B"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'complemento-error' : undefined}
                />
                <FieldError id="complemento-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="bairro"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Bairro *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'bairro-error' : undefined}
                />
                <FieldError id="bairro-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="cidade"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Cidade *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'cidade-error' : undefined}
                />
                <FieldError id="cidade-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="estado"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Estado *</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  // ✅ Select do Radix não suporta onBlur nativo — usa ref via field
                >
                  <SelectTrigger
                    id={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur} // ✅ marca como touched
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.error ? 'estado-error' : undefined}
                  >
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_BR.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.value} — {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id="estado-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>
      </FormSection>

      {/* ── Contato ───────────────────────────────────────────────────────── */}
      <FormSection title="Contato">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="contato@email.com"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'email-error' : undefined}
                />
                <FieldError id="email-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="celular"
            control={control}
            render={({ field, fieldState }) => (
              <MaskedInputField
                field={field}
                fieldState={fieldState}
                label="Celular"
                errorId="celular-error"
                placeholder="(00) 00000-0000"
                mask={formatTelefone}
                inputMode="tel"
              />
            )}
          />

          <Controller
            name="telefone"
            control={control}
            render={({ field, fieldState }) => (
              <MaskedInputField
                field={field}
                fieldState={fieldState}
                label="Telefone Fixo"
                errorId="telefone-error"
                placeholder="(00) 0000-0000"
                mask={formatTelefone}
                inputMode="tel"
              />
            )}
          />

          <Controller
            name="site"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Site</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="url"
                  placeholder="https://empresa.com.br"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'site-error' : undefined}
                />
                <FieldError id="site-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="observacoes"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Observações</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={3}
                  placeholder="Notas internas..."
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? 'observacoes-error' : undefined}
                />
                <FieldError id="observacoes-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>
      </FormSection>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {mode === 'create' ? 'Cadastrar Cliente' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}

export { ClienteForm }
