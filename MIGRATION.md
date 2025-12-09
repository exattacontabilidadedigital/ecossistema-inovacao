# 🚀 Migração de Dados - Banco Local para Produção

## 📋 Visão Geral

Este guia te ajuda a migrar os dados do seu banco SQLite local para a versão hospedada da aplicação.

## 📊 Dados Exportados

✅ **Dados exportados com sucesso do banco local:**
- **Usuários**: 1
- **Hubs**: 3  
- **Atores**: 2
- **Agendamentos**: 3
- **Contatos**: 1
- **Categorias**: 11
- **Tags**: 22
- **Posts do Blog**: 7
- **Configurações**: 0

## 🔄 Como Migrar os Dados

### 1. **Exportação Local (✅ Concluído)**
```bash
pnpm run export-data
```
- Arquivo gerado: `data-export.json`

### 2. **Importação na Produção**

#### Opção A: Via SSH/Terminal da Produção
```bash
# 1. Faça upload do arquivo data-export.json para o servidor
scp data-export.json usuario@servidor:/caminho/da/aplicacao/

# 2. No servidor, execute:
cd /caminho/da/aplicacao
npm run import-data
```

#### Opção B: Via Interface Web (Recomendado)
1. **Adicione uma rota de admin para importação**
2. **Faça upload seguro do arquivo**
3. **Execute a importação via interface**

### 3. **Implementar Rota de Importação Segura**

Vou criar uma rota de admin para você fazer a importação via interface web de forma segura.

## ⚠️ **Importante**

- ❗ **BACKUP**: Sempre faça backup dos dados de produção antes da importação
- 🔒 **SEGURANÇA**: A importação apaga dados existentes
- 🔑 **AUTENTICAÇÃO**: Use apenas com usuário admin logado
- 📝 **LOG**: Monitore os logs durante a importação

## 📂 Estrutura dos Dados

O arquivo `data-export.json` contém:
```json
{
  "users": [...],
  "hubs": [...],
  "actors": [...],
  "appointments": [...],
  "contacts": [...],
  "categories": [...],
  "tags": [...],
  "blogPosts": [...],
  "settings": [...],
  "exportedAt": "2025-12-09T...",
  "version": "1.0"
}
```

## 🔧 Próximos Passos

1. ✅ **Dados exportados** 
2. 🔄 **Criar rota de importação web**
3. 🚀 **Fazer a migração**
4. 🧪 **Testar a aplicação**

---

**💡 Dica**: Mantenha o arquivo `data-export.json` como backup dos seus dados locais.