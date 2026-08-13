export type Perfil = "PRODUTOR" | "TECNICO" | "GESTOR"

export type Usuario = {
  id: string
  nome: string
  email: string
  perfil: Perfil
  municipios: string[]
}

export type LoginRequest = {
  email: string
  senha: string
}

export type LoginResponse = {
  token: string
  usuario: Usuario
}

export type CadastroRequest = {
  nome: string
  email: string
  senha: string
  perfil: Perfil
  municipios: string[]
}

export type CadastroResponse = {
  mensagem: string
  usuario: Usuario
}