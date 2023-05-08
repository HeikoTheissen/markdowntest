### Transformation traverse
The traverse transformation returns instances of the input set that are or are related to nodes of a given recursive hierarchy in a specified tree order.

$H$, $Q$ and $p$ are the first three parameters defined above.
The fourth parameter $h$ of the `traverse` transformation is either `preorder` or `postorder`. $S$ is an optional fifth parameter that restricts $H$ to a subset $H'$. All following parameters are optional and form a list $o$ of expressions that could also be passed as a `$orderby` system query option. If $o$ is present, the transformation stable-sorts $H'$ by $o$.

The instances in the input set are related to one node (if $p$ is single-valued) or multiple nodes (if $p$ is collection-valued) in the recursive hierarchy. Given a node $x$, denote by $\hat F(x)$ the collection of all instances in the input set that are related to $x$; these collections can overlap. For each $w$ in $\hat F(x)$, the output set contains one instance that comprises the properties of $w$ and additional properties that identify the node $x$. These additional properties are independent of $w$ and are bundled into an instance called $\sigma(x)$. For example, if a sale $w$ is related to two sales organizations and hence contained in both $\hat F(x_1)$ and $\hat F(x_2)$, the output set will contain two instances $(w,\sigma(x_1))$ and $(w,\sigma(x_2))$ and $\sigma(x_i)$ contributes a navigation property `SalesOrganization`.

A transformation $F(x)$ is defined below such that $\hat F(x)$ is the output set of $F(x)$ applied to the input set of the traverse transformation.

Given a node $x$, the formulas below contain the transformation $\Pi_G(\sigma(x))$ in order to inject the properties of $\sigma(x)$ into the instances in $\hat F(x)$; this uses the function $\Pi_G$ that is defined in the simple grouping section. Further, $G$ is a list of data aggregation paths that shall be present in the output set, and $\sigma$ is a function that maps each hierarchy node $x$ to an instance of the input type containing the paths from $G$. As a consequence of the following definitions, only single-valued properties or collections of cardinality 1 are nested into $\sigma(x)$, apart from "final segments from G", therefore $\Pi_G(\sigma(x))$ is well-defined.

The definition of $\sigma(x)$ makes use of a function $a(\varepsilon,v,x)$, which returns a sparsely populated instance $u$ in which only the path $v$ has a value, namely $u[v]=x$.

Three cases are distinguished:
1. _Case where the recursive hierarchy is defined on the input set_  
   This case applies if the paths $p$ and $q$ are equal. Let $\sigma(x)=x$ and let $G$ be a list containing all structural and navigation properties of the entity type of $H$.  
   In this case $\Pi_G(\sigma(x))$ injects all properties of $x$ into the instances of the output set.
2. _Case where the recursive hierarchy is defined on the related entity type addressed by a navigation property path_  
   This case applies if $p'$ is a non-empty navigation property path and $p''$ an optional type-cast segment such that $p$ equals the concatenated path $p'/p''/q$. Let $\sigma(x)=a(\varepsilon,p'/p'',x)$ and let $G=(p')$.  
   In this case $\Pi_G(\sigma(x))$ injects the whole related entity $x$ into the instances of the output set. The by-default expansion of the navigation property path $p'$ is REQUIRED and MUST include at least the properties that are also required for the by-default expansion of a navigation property in the simple grouping case.
3. _Case where the recursive hierarchy is related to the input set only through equality of node identifiers, not through navigation_  
   If neither case 1 nor case 2 applies, let $\sigma(x)=a(\varepsilon,p,x[q])$ and let $G=(p)$.  
   In this case $\Pi_G(\sigma(x))$ injects only the node identifier of $x$ into the instances of the output set.

Here paths are considered equal if their non-type-cast segments refer to the same model elements when evaluated relative to the input set (see Example 64).

The function $a(u,v,x)$ takes an instance, a path and another instance as arguments and is defined recursively as follows:
1. If $u$ equals the special symbol $\varepsilon$, set $u$ to a new instance of the input type without properties and without entity-id.
2. If $v$ contains only one segment other than a type cast, let $v_1=v$, and let $x'=x$, then go to step 6.
3. Otherwise, let $v_1$ be the first property segment in $v$, possibly together with a preceding type-cast segment, let $v_2$ be any type-cast segment that immediately follows, and let $v_3$ be the remainder such that $v$ equals the concatenated path $v_1/v_2/v_3$ where ${}/v_2$ may be absent.
4. Let $u'$ be an instance of the type of $v_1/v_2$ without properties and without entity-id.
5. Let $x'=a(u',v_3,x)$.
6. If $v_1$ is single-valued, let $u[v_1]=x'$.
7. If $v_1$ is collection-valued, let $u[v_1]=a$ collection consisting of one item $x'$.
8. Return $u$.

(See Example 110.)

Let $r_1,\ldots,r_n$ be a sequence of the root nodes of the recursive hierarchy $(H',Q)$ preserving the order of $H'$ stable-sorted by $o$. Then the transformation $\.{traverse}(H,Q,p,h,S,o)$ is defined as equivalent to
$$\hbox{\tt concat}(R(r_1),\ldots,R(r_n)).$$
$R(x)$ is a transformation producing the specified tree order for a sub-hierarchy of $H'$ with root node $x$. Let $c_1,\ldots,c_m$ with $m\ge 0$ be an order-preserving sequence of the children of $x$ in $(H',Q)$.

If $h=\hbox{\tt preorder}$, then
$$R(x)= \hbox{\tt concat}(F(x)/\Pi_G(\sigma(x)),R(c_1),\ldots,R(c_m)).$$
If $h=\hbox{\tt postorder}$, then
$$R(x)= \hbox{\tt concat}(R(c_1),\ldots,R(c_m),F(x)/\Pi_G(\sigma(x))).$$
$F(x)$ is a transformation that determines for the specified node $x$ the instances of the input set having the same node identifier as $x$.

If $p$ contains only single-valued segments, then
$$F(x)=\hbox{\tt filter}(p\hbox{\tt\ eq }x[q]).$$
Otherwise $p=p_1/\ldots/p_k/s$ with $k\ge 1$ and  
$F(x)=\hbox{\tt filter}($  
$\quad p_1/\hbox{\tt any}(y_1:$  
$\qquad y_1/p_2/\hbox{\tt any}(y_2:$  
$\qquad\quad⋱$  
$\qquad\qquad y_{k-1}/p_k/\hbox{\tt any}(y_k:$  
$\qquad\qquad\quad y_k/s\hbox{\tt\ eq }x[q]$  
$\qquad\qquad )$  
$\qquad\quad⋰$  
$\qquad)$  
$\quad)$  
$)$  
where $y_1,\ldots,y_k$ denote `lambdaVariableExpr`s and ${}/s$ may be absent.
