[TextFragment](./vocab.xml#L4:~:text=<Function%20Name="-,TextFragment,-")

![alicebob.png](../generated/alicebob.png)

Note the included UML diagrams $m, m+1, \ldots, m+n-1$.

```mermaid
sequenceDiagram
  Alice ->> Bob: A
  Bob ->> Alice: B
```

Left|Right
----|-----
DrillState|Possible drill states are: <dl><dt>`expanded` <dd>if an entry precedes entries from deeper aggregation levels <dt>`collapsed` <dd>if an entry belongs to the highest non-expanded aggregation level, but not the deepest <dt>`leaf` <dd>if an entry belongs to the deepest aggregation level</dl>

```geojson
{"type": "FeatureCollection",
 "features": [{
   "type": "Feature",
   "bbox": [8.6, 49.2, 8.7, 49.4]
 }]}
```
