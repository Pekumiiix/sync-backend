import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

export default {
  types: {
    jsonb: {
      decorator: '@column()',
      tsType: 'JSON<any>',
      imports: [{ source: '#interfaces/db', typeImports: ['JSON'] }],
    },
  },

  tables: {
    users: {
      columns: {
        settings: {
          decorators: [{ name: '@column' }],
          tsType: 'JSON<UserSettingsSchema>',
          imports: [{ source: '#interfaces/user', typeImports: ['UserSettingsSchema'] }],
        },
        plan: {
          decorators: [{ name: '@column' }],
          tsType: 'PlanType',
          imports: [{ source: '#enums/user', typeImports: ['PlanType'] }],
        },
      },
    },
    folders: {
      columns: {
        recent_bookmarks_images: {
          decorators: [{ name: '@column' }],
          tsType: 'JSON<string[]>',
          imports: [{ source: '#interfaces/db', typeImports: ['JSON'] }],
        },
      },
    },
    bookmarks: {
      columns: {
        tags: {
          decorators: [{ name: '@column' }],
          tsType: 'JSON<string[]>',
          imports: [{ source: '#interfaces/db', typeImports: ['JSON'] }],
        },
        browser: {
          decorators: [{ name: '@column' }],
          tsType: 'BrowserType',
          imports: [{ source: '#enums/browser', typeImports: ['BrowserType'] }],
        },
      },
    },
    members: {
      columns: {
        role: {
          decorators: [{ name: '@column' }],
          tsType: 'RoleType',
          imports: [{ source: '#enums/member', typeImports: ['RoleType'] }],
        },
        access_level: {
          decorators: [{ name: '@column' }],
          tsType: 'AccessLevelType',
          imports: [{ source: '#enums/member', typeImports: ['AccessLevelType'] }],
        },
      },
    },
    invitations: {
      columns: {
        status: {
          decorators: [{ name: '@column' }],
          tsType: 'InvitationStatusType',
          imports: [{ source: '#enums/invitation', typeImports: ['InvitationStatusType'] }],
        },
        access_level: {
          decorators: [{ name: '@column' }],
          tsType: 'AccessLevelType',
          imports: [{ source: '#enums/member', typeImports: ['AccessLevelType'] }],
        },
      },
    },
    notifications: {
      columns: {
        data: {
          decorators: [{ name: '@column' }],
          tsType: 'JSON<NotificationData>',
          imports: [{ source: '#interfaces/notifications', typeImports: ['NotificationData'] }],
        },
        type: {
          decorators: [{ name: '@column' }],
          tsType: 'NotificationType',
          imports: [{ source: '#enums/notification', typeImports: ['NotificationType'] }],
        },
      },
    },
    browser_integrations: {
      columns: {
        browser: {
          decorators: [{ name: '@column' }],
          tsType: 'BrowserType',
          imports: [{ source: '#enums/browser', typeImports: ['BrowserType'] }],
        },
      },
    },
  },
} satisfies SchemaRules
