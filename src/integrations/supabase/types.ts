export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          id: string
          notes: string | null
          service_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_public"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_login_attempts: {
        Row: {
          created_at: string | null
          id: number
          ip: string | null
          reason: string | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          ip?: string | null
          reason?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          ip?: string | null
          reason?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          google_event_id: string | null
          id: string
          is_available: boolean | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          google_event_id?: string | null
          id?: string
          is_available?: boolean | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          google_event_id?: string | null
          id?: string
          is_available?: boolean | null
          start_time?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      campaign_logs: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          clicked_url: string | null
          created_at: string | null
          delivered_at: string | null
          email: string
          error_message: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          sent_at: string | null
          status: string | null
          suppression_reason: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          clicked_url?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          status?: string | null
          suppression_reason?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          clicked_url?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          status?: string | null
          suppression_reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          body_html: string
          body_variables: Json | null
          bypass_checks: boolean | null
          created_at: string | null
          created_by: string | null
          frequency_cap: Json | null
          id: string
          name: string
          scheduled_at: string | null
          segment_id: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          body_html: string
          body_variables?: Json | null
          bypass_checks?: boolean | null
          created_at?: string | null
          created_by?: string | null
          frequency_cap?: Json | null
          id?: string
          name: string
          scheduled_at?: string | null
          segment_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          body_html?: string
          body_variables?: Json | null
          bypass_checks?: boolean | null
          created_at?: string | null
          created_by?: string | null
          frequency_cap?: Json | null
          id?: string
          name?: string
          scheduled_at?: string | null
          segment_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      cart: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          session_id: string | null
          updated_at: string | null
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity: number
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_tags: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          tag_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          tag_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          tag_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "custom_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          discount_applied: number
          id: string
          order_id: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          discount_applied: number
          id?: string
          order_id?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          discount_applied?: number
          id?: string
          order_id?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean | null
          allowed_shipping_zones: Json | null
          bypass_shipping_restrictions: boolean | null
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number | null
          id: string
          max_discount_amount: number | null
          max_uses: number | null
          max_uses_per_user: number | null
          min_purchase_amount: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          allowed_shipping_zones?: Json | null
          bypass_shipping_restrictions?: boolean | null
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value?: number | null
          id?: string
          max_discount_amount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          allowed_shipping_zones?: Json | null
          bypass_shipping_restrictions?: boolean | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number | null
          id?: string
          max_discount_amount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      custom_tags: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      email_confirmation_tokens: {
        Row: {
          confirmed: boolean | null
          confirmed_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          token: string
          user_id: string
        }
        Insert: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          token: string
          user_id: string
        }
        Update: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          alias: string | null
          body_template: string
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          resend_template_id: string | null
          status: string | null
          subject_template: string
          synced_at: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          alias?: string | null
          body_template: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          resend_template_id?: string | null
          status?: string | null
          subject_template: string
          synced_at?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          alias?: string | null
          body_template?: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          resend_template_id?: string | null
          status?: string | null
          subject_template?: string
          synced_at?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          product_snapshot: Json | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          product_snapshot?: Json | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          product_snapshot?: Json | null
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          coupon_discount: number | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivered_at: string | null
          discount_amount: number | null
          estimated_delivery_date: string | null
          id: string
          infinitepay_capture_method: string | null
          infinitepay_installments: number | null
          infinitepay_invoice_slug: string | null
          infinitepay_order_nsu: string | null
          infinitepay_paid_amount: number | null
          infinitepay_receipt_url: string | null
          infinitepay_transaction_nsu: string | null
          notes: string | null
          order_number: string
          original_shipping_amount: number | null
          payment_method: string | null
          payment_provider: string | null
          payment_status: string | null
          shipped_at: string | null
          shipping_actual_cost: number | null
          shipping_address: Json
          shipping_amount: number | null
          shipping_breakdown: Json | null
          shipping_charged: number | null
          shipping_eta: string | null
          shipping_price: number | null
          shipping_provider: string | null
          shipping_raw: Json | null
          shipping_service: string | null
          shipping_status: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          tax_amount: number | null
          total_amount: number
          tracking_code: string | null
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          infinitepay_capture_method?: string | null
          infinitepay_installments?: number | null
          infinitepay_invoice_slug?: string | null
          infinitepay_order_nsu?: string | null
          infinitepay_paid_amount?: number | null
          infinitepay_receipt_url?: string | null
          infinitepay_transaction_nsu?: string | null
          notes?: string | null
          order_number: string
          original_shipping_amount?: number | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          shipped_at?: string | null
          shipping_actual_cost?: number | null
          shipping_address: Json
          shipping_amount?: number | null
          shipping_breakdown?: Json | null
          shipping_charged?: number | null
          shipping_eta?: string | null
          shipping_price?: number | null
          shipping_provider?: string | null
          shipping_raw?: Json | null
          shipping_service?: string | null
          shipping_status?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tax_amount?: number | null
          total_amount: number
          tracking_code?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          infinitepay_capture_method?: string | null
          infinitepay_installments?: number | null
          infinitepay_invoice_slug?: string | null
          infinitepay_order_nsu?: string | null
          infinitepay_paid_amount?: number | null
          infinitepay_receipt_url?: string | null
          infinitepay_transaction_nsu?: string | null
          notes?: string | null
          order_number?: string
          original_shipping_amount?: number | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          shipped_at?: string | null
          shipping_actual_cost?: number | null
          shipping_address?: Json
          shipping_amount?: number | null
          shipping_breakdown?: Json | null
          shipping_charged?: number | null
          shipping_eta?: string | null
          shipping_price?: number | null
          shipping_provider?: string | null
          shipping_raw?: Json | null
          shipping_service?: string | null
          shipping_status?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tax_amount?: number | null
          total_amount?: number
          tracking_code?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string | null
          device_type: string | null
          duration_seconds: number | null
          id: string
          is_authenticated: boolean | null
          metadata: Json | null
          page_path: string
          page_title: string | null
          referrer: string | null
          screen_height: number | null
          screen_width: number | null
          session_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          is_authenticated?: boolean | null
          metadata?: Json | null
          page_path: string
          page_title?: string | null
          referrer?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          is_authenticated?: boolean | null
          metadata?: Json | null
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          active: boolean | null
          attributes: Json | null
          created_at: string | null
          id: string
          name: string
          price_adjustment: number | null
          product_id: string
          sku: string | null
          stock_quantity: number | null
        }
        Insert: {
          active?: boolean | null
          attributes?: Json | null
          created_at?: string | null
          id?: string
          name: string
          price_adjustment?: number | null
          product_id: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Update: {
          active?: boolean | null
          attributes?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          price_adjustment?: number | null
          product_id?: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          featured: boolean | null
          features: Json | null
          height_cm: number | null
          id: string
          image_prompt: string | null
          images: Json | null
          length_cm: number | null
          min_stock_level: number | null
          name: string
          price: number
          short_description: string | null
          slug: string
          specifications: Json | null
          stock_quantity: number | null
          updated_at: string | null
          weight: number | null
          weight_g: number | null
          width_cm: number | null
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          featured?: boolean | null
          features?: Json | null
          height_cm?: number | null
          id?: string
          image_prompt?: string | null
          images?: Json | null
          length_cm?: number | null
          min_stock_level?: number | null
          name: string
          price: number
          short_description?: string | null
          slug: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_g?: number | null
          width_cm?: number | null
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          featured?: boolean | null
          features?: Json | null
          height_cm?: number | null
          id?: string
          image_prompt?: string | null
          images?: Json | null
          length_cm?: number | null
          min_stock_level?: number | null
          name?: string
          price?: number
          short_description?: string | null
          slug?: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_g?: number | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          avatar_url: string | null
          birth_date: string | null
          blocked_communications: boolean | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: number
          marketing_emails: boolean | null
          notifications_enabled: boolean | null
          phone: string | null
          postal_code: string | null
          profile_completed: boolean | null
          require_mfa: boolean | null
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          blocked_communications?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: never
          marketing_emails?: boolean | null
          notifications_enabled?: boolean | null
          phone?: string | null
          postal_code?: string | null
          profile_completed?: boolean | null
          require_mfa?: boolean | null
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          blocked_communications?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: never
          marketing_emails?: boolean | null
          notifications_enabled?: boolean | null
          phone?: string | null
          postal_code?: string | null
          profile_completed?: boolean | null
          require_mfa?: boolean | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          id: string
          new_values: Json | null
          old_values: Json | null
          performed_at: string | null
          performed_by: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string | null
          performed_by: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string | null
          performed_by?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      segments: {
        Row: {
          created_at: string | null
          created_by: string
          customer_count: number | null
          description: string | null
          filters_json: Json
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string
          customer_count?: number | null
          description?: string | null
          filters_json: Json
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          customer_count?: number | null
          description?: string | null
          filters_json?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          benefits: Json | null
          cost: number
          created_at: string | null
          duration: string
          id: string
          image: string | null
          name: string
          premium_features: Json | null
          price: number
          products: Json | null
          purpose: string
          steps: Json | null
        }
        Insert: {
          active?: boolean | null
          benefits?: Json | null
          cost: number
          created_at?: string | null
          duration: string
          id: string
          image?: string | null
          name: string
          premium_features?: Json | null
          price: number
          products?: Json | null
          purpose: string
          steps?: Json | null
        }
        Update: {
          active?: boolean | null
          benefits?: Json | null
          cost?: number
          created_at?: string | null
          duration?: string
          id?: string
          image?: string | null
          name?: string
          premium_features?: Json | null
          price?: number
          products?: Json | null
          purpose?: string
          steps?: Json | null
        }
        Relationships: []
      }
      settings_frete_motoboy: {
        Row: {
          base_max_km: number | null
          base_price: number | null
          enabled: boolean | null
          express_upcharge_pct: number | null
          handling_fee: number | null
          id: string
          mode_default: string | null
          origem_address: string | null
          origem_address_validated: boolean | null
          origem_lat: number | null
          origem_lng: number | null
          peak_days: string[] | null
          peak_end_time: string | null
          peak_start_time: string | null
          peak_upcharge_pct: number | null
          peak_weekend_end: string | null
          peak_weekend_start: string | null
          service_fee_dinamico: number | null
          tier1_max_km: number | null
          tier1_rate: number | null
          tier2_max_km: number | null
          tier2_rate: number | null
          tier3_max_km: number | null
          tier3_rate: number | null
          tier4_max_km: number | null
          tier4_rate: number | null
          updated_at: string | null
        }
        Insert: {
          base_max_km?: number | null
          base_price?: number | null
          enabled?: boolean | null
          express_upcharge_pct?: number | null
          handling_fee?: number | null
          id?: string
          mode_default?: string | null
          origem_address?: string | null
          origem_address_validated?: boolean | null
          origem_lat?: number | null
          origem_lng?: number | null
          peak_days?: string[] | null
          peak_end_time?: string | null
          peak_start_time?: string | null
          peak_upcharge_pct?: number | null
          peak_weekend_end?: string | null
          peak_weekend_start?: string | null
          service_fee_dinamico?: number | null
          tier1_max_km?: number | null
          tier1_rate?: number | null
          tier2_max_km?: number | null
          tier2_rate?: number | null
          tier3_max_km?: number | null
          tier3_rate?: number | null
          tier4_max_km?: number | null
          tier4_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          base_max_km?: number | null
          base_price?: number | null
          enabled?: boolean | null
          express_upcharge_pct?: number | null
          handling_fee?: number | null
          id?: string
          mode_default?: string | null
          origem_address?: string | null
          origem_address_validated?: boolean | null
          origem_lat?: number | null
          origem_lng?: number | null
          peak_days?: string[] | null
          peak_end_time?: string | null
          peak_start_time?: string | null
          peak_upcharge_pct?: number | null
          peak_weekend_end?: string | null
          peak_weekend_start?: string | null
          service_fee_dinamico?: number | null
          tier1_max_km?: number | null
          tier1_rate?: number | null
          tier2_max_km?: number | null
          tier2_rate?: number | null
          tier3_max_km?: number | null
          tier3_rate?: number | null
          tier4_max_km?: number | null
          tier4_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_events: {
        Row: {
          event_id: string
          event_type: string
          id: string
          order_id: string | null
          processed_at: string | null
          raw_data: Json | null
        }
        Insert: {
          event_id: string
          event_type: string
          id?: string
          order_id?: string | null
          processed_at?: string | null
          raw_data?: Json | null
        }
        Update: {
          event_id?: string
          event_type?: string
          id?: string
          order_id?: string | null
          processed_at?: string | null
          raw_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      suppression_list: {
        Row: {
          added_at: string | null
          added_by: string | null
          email: string
          id: string
          notes: string | null
          reason: string | null
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          email: string
          id?: string
          notes?: string | null
          reason?: string | null
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          email?: string
          id?: string
          notes?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      clientes_crm: {
        Row: {
          blocked_communications: boolean | null
          categorias_compradas: string[] | null
          cupons_usados: number | null
          data_nascimento: string | null
          dias_sem_comprar: number | null
          email: string | null
          genero: string | null
          id: string | null
          itens_carrinho: number | null
          itens_wishlist: number | null
          marketing_emails: boolean | null
          nome: string | null
          numero_pedidos: number | null
          preferencia_comunicacao: string | null
          produtos_favoritos: string[] | null
          segmento: string | null
          status: string | null
          telefone: string | null
          tem_carrinho_ativo: boolean | null
          ticket_medio: number | null
          ultima_compra: string | null
          ultima_comunicacao: string | null
          updated_at: string | null
          valor_total_gasto: number | null
        }
        Relationships: []
      }
      services_public: {
        Row: {
          active: boolean | null
          benefits: Json | null
          created_at: string | null
          duration: string | null
          id: string | null
          image: string | null
          name: string | null
          premium_features: Json | null
          price: number | null
          products: Json | null
          purpose: string | null
          steps: Json | null
        }
        Insert: {
          active?: boolean | null
          benefits?: Json | null
          created_at?: string | null
          duration?: string | null
          id?: string | null
          image?: string | null
          name?: string | null
          premium_features?: Json | null
          price?: number | null
          products?: Json | null
          purpose?: string | null
          steps?: Json | null
        }
        Update: {
          active?: boolean | null
          benefits?: Json | null
          created_at?: string | null
          duration?: string | null
          id?: string | null
          image?: string | null
          name?: string | null
          premium_features?: Json | null
          price?: number | null
          products?: Json | null
          purpose?: string | null
          steps?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_campaign_metrics: {
        Args: { _campaign_id: string }
        Returns: {
          bounced: number
          click_rate: number
          clicked: number
          delivered: number
          failed: number
          open_rate: number
          opened: number
          suppressed: number
          total_sent: number
        }[]
      }
      check_frequency_cap: {
        Args: {
          _lookback_days: number
          _max_per_week: number
          _user_id: string
        }
        Returns: boolean
      }
      check_stock_availability: {
        Args: {
          product_id_param: string
          quantity_param?: number
          variant_id_param?: string
        }
        Returns: boolean
      }
      cleanup_expired_tokens: { Args: never; Returns: undefined }
      decrement_product_stock: {
        Args: { product_id: string; quantity: number }
        Returns: undefined
      }
      decrement_variant_stock: {
        Args: { quantity: number; variant_id: string }
        Returns: undefined
      }
      get_analytics_by_period: {
        Args: { end_date: string; start_date: string }
        Returns: Json
      }
      get_top_pages: {
        Args: { limit_count?: number }
        Returns: {
          avg_duration: number
          page_path: string
          unique_users: number
          view_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_order_stock: {
        Args: { order_id_param: string }
        Returns: undefined
      }
      update_product_admin: {
        Args: { p_data: Json; p_product_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
