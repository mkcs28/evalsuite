import type { Reference } from "@/lib/metrics/schema";

/**
 * Primary methodological references. Every entry is a published, citable work.
 * Add a reference only after checking it against the original publication.
 */
const r = (citation: string): Reference => ({ citation });

export const REF = {
  matthews1975: r(
    "Matthews, B. W. (1975). Comparison of the predicted and observed secondary structure of T4 phage lysozyme. Biochimica et Biophysica Acta, 405(2), 442–451.",
  ),
  cohen1960: r(
    "Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37–46.",
  ),
  brier1950: r(
    "Brier, G. W. (1950). Verification of forecasts expressed in terms of probability. Monthly Weather Review, 78(1), 1–3.",
  ),
  hanley1982: r(
    "Hanley, J. A., & McNeil, B. J. (1982). The meaning and use of the area under a receiver operating characteristic (ROC) curve. Radiology, 143(1), 29–36.",
  ),
  fawcett2006: r(
    "Fawcett, T. (2006). An introduction to ROC analysis. Pattern Recognition Letters, 27(8), 861–874.",
  ),
  davis2006: r(
    "Davis, J., & Goadrich, M. (2006). The relationship between precision-recall and ROC curves. Proceedings of the 23rd International Conference on Machine Learning, 233–240.",
  ),
  saito2015: r(
    "Saito, T., & Rehmsmeier, M. (2015). The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets. PLOS ONE, 10(3), e0118432.",
  ),
  vanrijsbergen1979: r(
    "van Rijsbergen, C. J. (1979). Information Retrieval (2nd ed.). Butterworths.",
  ),
  brodersen2010: r(
    "Brodersen, K. H., Ong, C. S., Stephan, K. E., & Buhmann, J. M. (2010). The balanced accuracy and its posterior distribution. Proceedings of the 20th International Conference on Pattern Recognition, 3121–3124.",
  ),
  altman1994a: r(
    "Altman, D. G., & Bland, J. M. (1994). Diagnostic tests 1: sensitivity and specificity. BMJ, 308(6943), 1552.",
  ),
  altman1994b: r(
    "Altman, D. G., & Bland, J. M. (1994). Diagnostic tests 2: predictive values. BMJ, 309(6947), 102.",
  ),
  youden1950: r("Youden, W. J. (1950). Index for rating diagnostic tests. Cancer, 3(1), 32–35."),
  glas2003: r(
    "Glas, A. S., Lijmer, J. G., Prins, M. H., Bonsel, G. J., & Bossuyt, P. M. M. (2003). The diagnostic odds ratio: a single indicator of test performance. Journal of Clinical Epidemiology, 56(11), 1129–1135.",
  ),
  hosmer1980: r(
    "Hosmer, D. W., & Lemeshow, S. (1980). Goodness of fit tests for the multiple logistic regression model. Communications in Statistics – Theory and Methods, 9(10), 1035–1049.",
  ),
  cox1958: r(
    "Cox, D. R. (1958). Two further applications of a model for binary regression. Biometrika, 45(3/4), 562–565.",
  ),
  naeini2015: r(
    "Naeini, M. P., Cooper, G. F., & Hauskrecht, M. (2015). Obtaining well calibrated probabilities using Bayesian binning. Proceedings of the AAAI Conference on Artificial Intelligence, 29(1).",
  ),
  vickers2006: r(
    "Vickers, A. J., & Elkin, E. B. (2006). Decision curve analysis: a novel method for evaluating prediction models. Medical Decision Making, 26(6), 565–574.",
  ),
  efron1979: r(
    "Efron, B. (1979). Bootstrap methods: another look at the jackknife. The Annals of Statistics, 7(1), 1–26.",
  ),
  efron1987: r(
    "Efron, B. (1987). Better bootstrap confidence intervals. Journal of the American Statistical Association, 82(397), 171–185.",
  ),
  wilson1927: r(
    "Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. Journal of the American Statistical Association, 22(158), 209–212.",
  ),
  clopper1934: r(
    "Clopper, C. J., & Pearson, E. S. (1934). The use of confidence or fiducial limits illustrated in the case of the binomial. Biometrika, 26(4), 404–413.",
  ),
  student1908: r("Student. (1908). The probable error of a mean. Biometrika, 6(1), 1–25."),
  welch1947: r(
    "Welch, B. L. (1947). The generalization of 'Student's' problem when several different population variances are involved. Biometrika, 34(1–2), 28–35.",
  ),
  mann1947: r(
    "Mann, H. B., & Whitney, D. R. (1947). On a test of whether one of two random variables is stochastically larger than the other. The Annals of Mathematical Statistics, 18(1), 50–60.",
  ),
  wilcoxon1945: r(
    "Wilcoxon, F. (1945). Individual comparisons by ranking methods. Biometrics Bulletin, 1(6), 80–83.",
  ),
  kruskal1952: r(
    "Kruskal, W. H., & Wallis, W. A. (1952). Use of ranks in one-criterion variance analysis. Journal of the American Statistical Association, 47(260), 583–621.",
  ),
  friedman1937: r(
    "Friedman, M. (1937). The use of ranks to avoid the assumption of normality implicit in the analysis of variance. Journal of the American Statistical Association, 32(200), 675–701.",
  ),
  mcnemar1947: r(
    "McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. Psychometrika, 12(2), 153–157.",
  ),
  shapiro1965: r(
    "Shapiro, S. S., & Wilk, M. B. (1965). An analysis of variance test for normality (complete samples). Biometrika, 52(3–4), 591–611.",
  ),
  delong1988: r(
    "DeLong, E. R., DeLong, D. M., & Clarke-Pearson, D. L. (1988). Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach. Biometrics, 44(3), 837–845.",
  ),
  cohen1988: r(
    "Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences (2nd ed.). Lawrence Erlbaum Associates.",
  ),
  hedges1981: r(
    "Hedges, L. V. (1981). Distribution theory for Glass's estimator of effect size and related estimators. Journal of Educational Statistics, 6(2), 107–128.",
  ),
  cramer1946: r(
    "Cramér, H. (1946). Mathematical Methods of Statistics. Princeton University Press.",
  ),
  dunn1961: r(
    "Dunn, O. J. (1961). Multiple comparisons among means. Journal of the American Statistical Association, 56(293), 52–64.",
  ),
  holm1979: r(
    "Holm, S. (1979). A simple sequentially rejective multiple test procedure. Scandinavian Journal of Statistics, 6(2), 65–70.",
  ),
  hochberg1988: r(
    "Hochberg, Y. (1988). A sharper Bonferroni procedure for multiple tests of significance. Biometrika, 75(4), 800–802.",
  ),
  bh1995: r(
    "Benjamini, Y., & Hochberg, Y. (1995). Controlling the false discovery rate: a practical and powerful approach to multiple testing. Journal of the Royal Statistical Society: Series B, 57(1), 289–300.",
  ),
  dice1945: r(
    "Dice, L. R. (1945). Measures of the amount of ecologic association between species. Ecology, 26(3), 297–302.",
  ),
  jaccard1912: r(
    "Jaccard, P. (1912). The distribution of the flora in the alpine zone. New Phytologist, 11(2), 37–50.",
  ),
  long2015: r(
    "Long, J., Shelhamer, E., & Darrell, T. (2015). Fully convolutional networks for semantic segmentation. Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition, 3431–3440.",
  ),
  huttenlocher1993: r(
    "Huttenlocher, D. P., Klanderman, G. A., & Rucklidge, W. J. (1993). Comparing images using the Hausdorff distance. IEEE Transactions on Pattern Analysis and Machine Intelligence, 15(9), 850–863.",
  ),
  cheng2021: r(
    "Cheng, B., Girshick, R., Dollár, P., Berg, A. C., & Kirillov, A. (2021). Boundary IoU: Improving object-centric image segmentation evaluation. Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, 15334–15342.",
  ),
  everingham2010: r(
    "Everingham, M., Van Gool, L., Williams, C. K. I., Winn, J., & Zisserman, A. (2010). The PASCAL Visual Object Classes (VOC) challenge. International Journal of Computer Vision, 88(2), 303–338.",
  ),
  lin2014: r(
    "Lin, T.-Y., Maire, M., Belongie, S., Hays, J., Perona, P., Ramanan, D., Dollár, P., & Zitnick, C. L. (2014). Microsoft COCO: Common objects in context. European Conference on Computer Vision (ECCV), 740–755.",
  ),
  willmott2005: r(
    "Willmott, C. J., & Matsuura, K. (2005). Advantages of the mean absolute error (MAE) over the root mean square error (RMSE) in assessing average model performance. Climate Research, 30(1), 79–82.",
  ),
  hyndman2006: r(
    "Hyndman, R. J., & Koehler, A. B. (2006). Another look at measures of forecast accuracy. International Journal of Forecasting, 22(4), 679–688.",
  ),
  huber1964: r(
    "Huber, P. J. (1964). Robust estimation of a location parameter. The Annals of Mathematical Statistics, 35(1), 73–101.",
  ),
  koenker1978: r(
    "Koenker, R., & Bassett, G. (1978). Regression quantiles. Econometrica, 46(1), 33–50.",
  ),
} as const;
