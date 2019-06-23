# Migration `watch-20190623232620`

This migration has been generated at 6/23/2019, 11:26:21 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "lift"."BadWord"("id" TEXT NOT NULL  ,"value" TEXT NOT NULL DEFAULT '' ,PRIMARY KEY ("id"));
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration watch-20190623230631..watch-20190623232620
--- datamodel.dml
+++ datamodel.dml
@@ -23,5 +23,9 @@
     reason String
     timestamp DateTime   @default(now())
     authorId String @unique
     target User
+}
+model BadWord {
+    id    String  @default(cuid()) @id @unique
+    value String @unique
 }
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20190623232620)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20190623232620'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
