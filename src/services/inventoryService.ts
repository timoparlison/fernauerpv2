/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client'
import type { Article, ArticleFormData } from '@/components/inventory/articles/types'

const ARTICLE_FIELDS =
  'id, article_number, article_type, article_name, additional_description, unit, net_weight, material, country_of_origin, customs_tariff_number, drawing_number, drawing_revision, drawing_file_path, drawing_file_name, customer_qr_code_path, default_price, manufacturing_cost, default_warranty_months, purchase_account, supplier_id, supplier_article_number, raw_material_id, raw_material_quantity, requires_calibration, requires_certificate, requires_expiry_tracking, requires_incoming_inspection, tracking_mode, vision_inspection_enabled, version, active, deleted_at, created_at, updated_at'

const db = supabase as any

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await db
    .from('articles')
    .select(ARTICLE_FIELDS)
    .is('deleted_at', null)
    .order('article_number')
  if (error) throw error
  return (data ?? []) as Article[]
}

export async function fetchArticleByNumber(articleNumber: string): Promise<Article | null> {
  const { data, error } = await db
    .from('articles')
    .select(ARTICLE_FIELDS)
    .eq('article_number', articleNumber)
    .is('deleted_at', null)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as Article
}

export async function fetchHighestArticleNumberForPrefix(prefix: string): Promise<string | null> {
  const { data, error } = await db
    .from('articles')
    .select('article_number')
    .like('article_number', `${prefix}-%`)
    .order('article_number', { ascending: false })
    .limit(1)
  if (error) throw error
  return data?.[0]?.article_number ?? null
}

export async function generateArticleNumber(prefix: string): Promise<string> {
  const highest = await fetchHighestArticleNumberForPrefix(prefix)
  if (!highest) return `${prefix}-000001`
  const numPart = highest.replace(`${prefix}-`, '')
  const next = parseInt(numPart, 10) + 1
  return `${prefix}-${String(next).padStart(6, '0')}`
}

export async function createArticle(articleData: ArticleFormData & { article_number: string }): Promise<Article> {
  const { data, error } = await db
    .from('articles')
    .insert([{ ...articleData, active: true, version: 1 }])
    .select(ARTICLE_FIELDS)
    .single()
  if (error) throw error
  return data as Article
}

export async function updateArticle(
  id: string,
  updates: Partial<ArticleFormData> & { active?: boolean },
): Promise<Article> {
  const { data, error } = await db
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select(ARTICLE_FIELDS)
    .single()
  if (error) throw error
  return data as Article
}

export async function toggleArticleStatus(id: string, active: boolean): Promise<Article> {
  const { data, error } = await db
    .from('articles')
    .update({ active })
    .eq('id', id)
    .select(ARTICLE_FIELDS)
    .single()
  if (error) throw error
  return data as Article
}

export async function importArticlesBatch(batch: Record<string, unknown>[]): Promise<void> {
  const { error } = await db.from('articles').insert(batch)
  if (error) throw error
}
