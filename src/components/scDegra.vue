<template>
  <div>
    <svg id="mySvg"></svg>
  </div>
</template>

<script>
import dagreD3 from "dagre-d3";
import * as d3 from "d3";

export default {
  name: "degraD3",
  props: {
    nodes: {
      type: Array,
      default: () => [],
    },
    edges: {
      type: Array,
      default: () => [],
    },
    rankdir: {
      type: String,
      default: "DL",
    },
  },
  data() {
    return {
      g: null,
      inner: null,
      render: null,
    };
  },
  watch: {
    nodes: {
      handler() {
        this.updateGraph();
      },
      deep: true,
    },
    edges: {
      handler() {
        this.updateGraph();
      },
      deep: true,
    },
  },
  mounted() {
    this.initGraph();
  },
  methods: {
    /** 初始化图 */
    initGraph() {
      this.g = new dagreD3.graphlib.Graph({ multigraph: true }).setGraph({
        rankdir: this.rankdir,
        nodesep: 40,
        edgesep: 25,
        ranksep: 20,
        marginx: 80,
        marginy: 10,
      });

      this.render = new dagreD3.render();
      let svg = d3.select("#mySvg").attr("preserveAspectRatio", "xMidYMid meet");
      this.inner = svg.append("g");

      // 缩放支持
      let zoom = d3.zoom().on("zoom", (event) => {
        this.inner.attr("transform", event.transform);
      });
      svg.call(zoom);

      this.renderGraph();
      this.bindNodeClick(svg);
    },

    /** 渲染节点和边 */
    renderGraph() {
      let that = this;
      that.inner.selectAll("*").remove();  // 清空内部元素
      // 清空原有节点和边
      that.g.nodes().forEach((v) => that.g.removeNode(v));
      that.g.edges().forEach((e) => that.g.removeEdge(e));

      // 添加节点
      that.nodes.forEach((item) => {
        if (item.id && item.label) {
          that.g.setNode(item.id, {
            label: item.label,
            shape: item.shape,
            toolText: item.label,
            style: "fill:#fff;stroke:#000",
            labelStyle: "fill:#000;",
            rx: 5,
            ry: 5,
          });
        }
      });

      const edgeGroups = {};
      that.edges.forEach((edge) => {
        const key = `${edge.source}_${edge.target}`;
        if (!edgeGroups[key]) edgeGroups[key] = [];
        edgeGroups[key].push(edge);
      });

      // 定义几种可选曲线
      const curves = [d3.curveBasis, d3.curveCardinal, d3.curveBundle.beta(0.8)];

      // 按分组循环，避免重叠
      Object.values(edgeGroups).forEach((edges) => {
        edges.forEach((edge, index) => {
          let edgeColor = "green";
          if (edge.label === "驳回" || edge.label === "退回") edgeColor = "red";

          that.g.setEdge(
            edge.source,
            edge.target,
            {
              label: edge.label,
              id: edge.id,
              // ✅ 给每条边做区分
              curve: curves[index % curves.length],
              labeloffset: 16 + index * 10, // 标签错开
              minlen: 2 + index,            // 强制 dagre 给一点空间
              style: `fill:none;stroke:${edgeColor};stroke-width:1.5px`,
            },
            `${edge.source}_${edge.target}_${edge.id}`
          );
        });
      });

      // 渲染图
      this.render(this.inner, this.g);

      // 自动计算 viewBox 尺寸
      const { width, height } = this.g.graph();
      d3.select("#mySvg")
        .attr("viewBox", `0 0 ${width + 2} ${height + 2}`);
    },

    /** 更新图形 */
    updateGraph() {
      if (!this.g) return;
      this.renderGraph();
    },

    /** 绑定点击事件 */
    bindNodeClick(svg) {
      let that = this;
      svg.selectAll("g.node").on("click", function (event, d) {
        svg.selectAll("g.node")._groups[0].forEach((item) => {
          d3.select(item).select("rect").style("fill", "#fff");
        });

        const node = d3.select(this);
        const currentColor = node.select("rect").style("fill");
        if (currentColor === "rgb(255, 255, 255)") {
          node.select("rect").style("fill", "#f00");
        } else {
          node.select("rect").style("fill", "#fff");
        }

        let batch = "";
        that.nodes.forEach((item) => {
          if (item.id === d) batch = item.label;
        });
        that.$emit("nodeClick", batch);
      });
    },

    /** 缩放演示 */
    scaleUp() {
      var svg = document.getElementById("mySvg");
      svg.style.transform = "scale(0.5)";
    },
  },
};
</script>

<style scoped>
svg {
  font-size: 14px;
}

.node rect {
  stroke: #606266;
  fill: #fff;
}

.edgePath path {
  stroke: #606266;
  fill: #333;
  stroke-width: 1.5px;
}
</style>
