pragma circom 2.1.3;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/switcher.circom";
include "../node_modules/circomlib/circuits/mimcsponge.circom";

template MatmulVec(m, n) {
    // Return out = Ax
    signal input A[m][n];
    signal input x[n];
    signal output out[m];
    
    signal s[m][n + 1];          // Store intermediate sums
    for (var i = 0; i < m; i++) {
        s[i][0] <== 0;
        for (var j = 1; j <= n; j++) {
            s[i][j] <== s[i][j-1] + A[i][j-1] * x[j-1];
        }
        out[i] <== s[i][n];
    }
}

template ArgMax (n) {
    signal input in[n];
    signal output out;
    component gts[n];            // store comparators
    component switchers[n+1];    // switcher for max flow
    component aswitchers[n+1];   // switcher for arg max control flow

    signal maxs[n+1];            // storage for running max, argmax
    signal amaxs[n+1];

    maxs[0] <== in[0];    
    amaxs[0] <== 0;
    for(var i = 0; i < n; i++) {
        gts[i] = GreaterThan(20);
        switchers[i+1] = Switcher();
        aswitchers[i+1] = Switcher();

        // Check if the current max is larger than the current element
        gts[i].in[1] <== maxs[i];
        gts[i].in[0] <== in[i];

        switchers[i+1].sel <== gts[i].out;
        switchers[i+1].L <== maxs[i];
        switchers[i+1].R <== in[i];
        aswitchers[i+1].sel <== gts[i].out;
        aswitchers[i+1].L <== amaxs[i];
        aswitchers[i+1].R <== i;
       
        // Update the running max, arg max
        maxs[i+1] <== switchers[i+1].outL;
        amaxs[i+1] <== aswitchers[i+1].outL;
    }
    out <== amaxs[n];
}

template proveModel(m, n) {
    // Model does: predicted class = argmax(Ax)
    signal input A[m][n];
    signal input x[n];               // input to model
    // signal input expHash;            // expected hash of model
    signal output class; 
  
    signal modelHash;
    component mimcModel = MiMCSponge(m*n, 220, 1);
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            mimcModel.ins[i*n + j] <== A[i][j];
        }
    }
    mimcModel.k <== 0;
    modelHash <== mimcModel.outs[0];
    // expHash === modelHash;                 // verify the hashes
    
    // Do the matrix-vector multiplication
    component mmv = MatmulVec(m, n);
    component amax = ArgMax(m);
    for (var j = 0; j < n; j++) {
        for (var i = 0; i < m; i++) {
            mmv.A[i][j] <== A[i][j];
        }
        mmv.x[j] <== x[j];
    }
    
    // Compute the arg max
    for (var i = 0; i < m; i++) {
        amax.in[i] <== mmv.out[i];
    }
    class <== amax.out;
}



component main = proveModel(3, 2);