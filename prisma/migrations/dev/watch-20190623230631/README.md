# Migration `watch-20190623230631`

This migration has been generated at 6/23/2019, 11:06:32 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
DROP TABLE "lift"."new_User";

ALTER TABLE "lift"."User" ADD COLUMN "opinion" TEXT   ;
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration watch-20190623222423..watch-20190623230631
--- datamodel.dml
+++ datamodel.dml
@@ -15,8 +15,9 @@
     joinDate DateTime   @default(now())
     warns Warn[]
     messages Int @default(0)
     verified Boolean @default(false)
+    opinion String?
 }
 model Warn {
     id    String  @default(cuid()) @id @unique
     reason String
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20190623230631)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20190623230631'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
