<template>
  <Sheet>
    <SheetTrigger><slot></slot></SheetTrigger>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>{{props.title}}</SheetTitle>
        <SheetDescription>
          {{props.description}}
        </SheetDescription>
      </SheetHeader>
      <slot name="content"></slot>
    </SheetContent>
  </Sheet>
</template>
<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface  Props {
  title: string,
  description: string
}

const props = defineProps<Props>()
</script>

<style scoped>

</style>