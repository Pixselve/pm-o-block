# Migration `watch-20190623215505`

This migration has been generated at 6/23/2019, 9:55:09 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
DROP TABLE "lift"."Post";

CREATE TABLE "lift"."Warn"("id" TEXT NOT NULL  ,"reason" TEXT NOT NULL DEFAULT '' ,"timestamp" DATE NOT NULL  ,"targetId" TEXT NOT NULL DEFAULT '' ,"author" TEXT NOT NULL  REFERENCES User(id),PRIMARY KEY ("id"));

PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new_User"("id" TEXT NOT NULL  ,"discordId" TEXT NOT NULL DEFAULT '' ,"joinDate" DATE NOT NULL  ,"messages" INTEGER NOT NULL DEFAULT 0 ,PRIMARY KEY ("id"));

INSERT INTO "new_User" ("id") SELECT "id" from "User"

DROP TABLE "lift"."User";

ALTER TABLE "lift"."new_User" RENAME TO "User";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration watch-20190623212724..watch-20190623215505
--- datamodel.dml
+++ datamodel.dml
@@ -10,18 +10,16 @@
 }
 model User {
     id    String  @default(cuid()) @id @unique
-    email String  @unique
-    name  String?
-    posts Post[]
+    discordId String  @unique
+    joinDate DateTime   @default(now())
+    warns Warn[]
+    messages Int @default(0)
 }
-
-model Post {
-    id        String   @default(cuid()) @id @unique
-    createdAt DateTime @default(now())
-    updatedAt DateTime @updatedAt
-    published Boolean
-    title     String
-    content   String?
-    author    User?
+model Warn {
+    id    String  @default(cuid()) @id @unique
+    reason String
+    timestamp DateTime   @default(now())
+    author User
+    targetId String @unique
 }
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20190623215505)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20190623215505'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
