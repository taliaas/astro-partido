<template>
  <Card>
    <CardHeader>
      <CardTitle>Resumen de KPIs</CardTitle>
      <CardDescription>Visualización de los principales indicadores de rendimiento</CardDescription>
    </CardHeader>
    <CardContent class="pl-2">
      <div style="width: 100%; height: 300px;">
        <AbsenceReasonsChart />
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AbsenceReasonsChart from "@/components/Home/AbsenceReasonsChart.vue";

</script>